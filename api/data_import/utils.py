from data_import.conf import conf
from data_import.log import log
from typing import Any, Dict, List, Tuple, Union
from pandas import DataFrame
import numpy as np
import pyproj
from pyproj import CRS
from shapely.geometry import Point
from shapely.ops import transform
from models.enums import MainActivityCode


def _replace_all(text: str, dic: Dict[str, str]):
    for k, v in dic.items():
        text = text.replace(k, v)
    return text


project = pyproj.Transformer.from_crs(
    crs_from=CRS('epsg:4326'),
    crs_to=CRS(f'epsg:{conf.proj_crs_epsg}'),
    always_xy=True
)


def _clear_field_for_main_activity_7(row: str, field_name) -> Union[None, Any]:
    if (
        row['mainActivityCode'] == MainActivityCode.SEVEN_A.value or
        row['mainActivityCode'] == MainActivityCode.SEVEN_A_I.value or
        row['mainActivityCode'] == MainActivityCode.SEVEN_A_II.value or
        row['mainActivityCode'] == MainActivityCode.SEVEN_A_III.value
    ):
        return None
    return row[field_name]


def _clear_fields_for_main_activity_7(df: DataFrame, field_names: List[str]):
    for field_name in field_names:
        df[field_name] = df.apply(
            lambda row: _clear_field_for_main_activity_7(row, field_name),
            axis=1
        )
    return df


def clear_location_data_for_main_activity_7(
    facilities: DataFrame
) -> DataFrame:
    df = _clear_fields_for_main_activity_7(
        facilities,
        [
            'pointGeometryLat', 'pointGeometryLon',
            'streetName', 'postalCode', 'buildingNumber',
            'authorityTelephoneNo'
        ]
    )
    # keep series x & y as integers (as before)
    df['x'] = df['x'].astype('Int64')
    df['y'] = df['y'].astype('Int64')
    return df


def create_point(
    x: float,
    y: float,
    main_activity: MainActivityCode
) -> Point:
    if ( # weaken coordinates of main activity 7
        main_activity == MainActivityCode.SEVEN_A.value or
        main_activity == MainActivityCode.SEVEN_A_I.value or
        main_activity == MainActivityCode.SEVEN_A_II.value or
        main_activity == MainActivityCode.SEVEN_A_III.value
    ):
        x = x + 0.1
        y = y + 0.1
    return Point(x, y)


def add_projected_x_y_columns(
    df: DataFrame,
    lon_col='pointGeometryLon',
    lat_col='pointGeometryLat'
) -> DataFrame:
    df['point_geom_wgs'] = df.apply(
         lambda row: create_point(row[lon_col], row[lat_col], row['mainActivityCode']),
         axis=1
    )
    df['point_geom_proj'] = [
        transform(project.transform, geom) for geom in df['point_geom_wgs']
    ]
    df['x'] = [round(geom.x) for geom in df['point_geom_proj']]
    df['y'] = [round(geom.y) for geom in df['point_geom_proj']]
    df.drop(columns=['point_geom_wgs', 'point_geom_proj'], inplace=True)


_id_cleanup: Dict[str, str] = {
    'http://paikkatiedot.fi/so/1002031/pf/ProductionInstallationPart/': '',
    'http://paikkatiedot.fi/so/1002031/pf/ProductionFacility/': '',
    '.ProductionFacility': '',
    '.FACILITY': '',
    '.': '_',
    '-': '_',
    '/': '_',
    ';': '_'
}


def clean_names(org_str: str) -> str:
    found = []
    names = ['Ari', 'Juha', 'Holm', 'Kangas']
    for name in names:
        if org_str.find(name) > -1:
            found.append(name)
    if len(found) > 1: # interpreted to include a name
        for name in found:
            org_str = org_str.replace(name, 'N.')
    return org_str


def clean_id(id_str: str) -> str:
    if not id_str:
        raise ValueError("Missing Facility ID")
    clean_id = _replace_all(id_str, _id_cleanup)
    if not clean_id:
        raise ValueError("Missing Facility ID")
    return clean_id


def ensure_unique_ids(df: DataFrame, id_col='facilityId'):
    """Throws ValueError if duplicate IDs are found in facilities DataFrame.
    """

    ids = list(df[id_col])
    if len(ids) != len(set(ids)):
        raise ValueError(
            f'Found IDs that are not unique in column {id_col}, ',
            f'all: {len(ids)}, unique: {len(set(ids))}.'
        )


_characters_by_number_0_10 = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten'
}


def _get_main_activity_code_enum_name(code: str) -> str:
    if code == 'MISSING':
        return code
    num = int(code[0])
    num_english = _characters_by_number_0_10.get(num)
    name = f"{num_english}{code[1:].strip(')')}"
    return _replace_all(
        name,
        {
            ')(': '_',
            '(': '_',
            ')': '_'
        }
    ).upper()


def print_main_activity_codes_as_enum(df: DataFrame):
    unique_values = df['mainActivityCode'].unique()
    log('Unique values in column "mainActivityCode":')
    for value in sorted([v for v in unique_values if v is not None]):
        enum_name = _get_main_activity_code_enum_name(value)
        log(f"    {enum_name} = '{value}'")
    log('\n')


def print_unique_values_as_enum(df: DataFrame, col: str):
    unique_values = df[col].unique()
    log(f'Unique values in column "{col}":')
    for value in sorted([v for v in unique_values if v is not None]):
        log(f"    {value} = '{value}'")
    log('\n')


def ensure_no_unlinked_releases_or_transfers(
    facilities: DataFrame,
    releases_or_transfers: DataFrame,
    error_label='releases'
):
    """Throws ValueError if some releases are found that are not linked to
    facilities by facilityId.
    """

    facility_ids = list(facilities['facilityId'])
    unlinked = [
        fid for fid
        in list(releases_or_transfers['facilityId'])
        if fid not in facility_ids
    ]
    if unlinked:
        error = (
            f'Found {len(unlinked)} unlinked {error_label} by facilityId'
            f' (i.e. {error_label} without facility in the facilities'
            ' DataFrame).'
        )
        raise ValueError(error)


def _facilities_can_be_merged(duplicates: List[dict]) -> bool:
    """For a given set of possible duplicate facilities, returns a boolean
    value indicating whether they can be merged. Currently only facilities
    with main activity code 7* cannot be merged.
    TODO: add additional logic here if needed.
    """

    has_main_activity_7 = [
        d for d in duplicates
        if '7' in d['mainActivityCode']
    ]
    if has_main_activity_7:
        return False
    return True


def _get_facility_to_merge_to(duplicates: List[dict]) -> Union[dict, None]:
    """For a given set of duplicate facilities, returns the facility that
    the other ones should be merged to. Currently the latest facility that
    has CompetentAuthorityEPRTRId is considered as the merge-to-facility.

    Returns None if merge-to-facility cannot be determined.
    """

    duplicates_sorted = sorted(
        duplicates,
        key=lambda d: d['reportingYear'],
        reverse=True
    )
    for d in duplicates_sorted:
        # return first/latest facility that has CompetentAuthorityEPRTRId
        # as the merge-to-facility
        if not np.isnan(d['CompetentAuthorityEPRTRId']):
            return d
    return None


def _get_merge_map_for_duplicates(
    duplicates: List[dict]
) -> Union[Dict[str, str], None]:
    """For a given set of possibly duplicate facilities, returns a dictionary
    representing merge actions (from facilityId to another facilityId) that
    are needed. Returns None if merge-to-facility cannot be determined.
    """

    merge_to = _get_facility_to_merge_to(duplicates)
    if not merge_to:
        return None
    return {
        d['facilityId']: merge_to['facilityId']
        for d in duplicates
        if d['facilityId'] != merge_to['facilityId']
    }


def _get_id_to_id_merge_map_for_facilities(
    facilities: DataFrame
) -> Union[Dict[str, str], None]:
    facility_dicts = facilities.to_dict(orient='records')
    facility_dicts = sorted(
        facility_dicts,
        key=lambda d: d['nameOfFeature']
    )

    # collect list of facilities by name
    facilities_by_name: Dict[str, List[dict]] = {
        facility['nameOfFeature']: [
            f for f in facility_dicts
            if f['nameOfFeature'] == facility['nameOfFeature']
        ]
        for facility in facility_dicts
    }

    # keep list of facilities by name if there are more than one
    # facility by the name
    duplicates_by_name: Dict[str, List[dict]] = {
        name: facilities
        for name, facilities in facilities_by_name.items()
        if len(facilities) > 1
    }

    merge_maps_all: List[Dict[str, str]] = []
    if duplicates_by_name:
        log('Found duplicate facilities by name (to merge):')
        for name, duplicates in duplicates_by_name.items():
            if not _facilities_can_be_merged(duplicates):
                continue
            merge_map = _get_merge_map_for_duplicates(duplicates)
            if not merge_map:
                continue
            log(f'  name: {name}, IDs to merge ({{from: to}}): {merge_map}')
            merge_maps_all.append(merge_map)

    # create final merge dictionary for duplicate facilities
    # { id_to_merge: id_to_merge_to,... }
    final_id_to_id_merge_map = {}
    for merge_map in merge_maps_all:
        for merge_from_id, merge_to_id in merge_map.items():
            final_id_to_id_merge_map[merge_from_id] = merge_to_id

    log(f'Found {len(final_id_to_id_merge_map)} facilities to merge')

    if final_id_to_id_merge_map:
        return final_id_to_id_merge_map

    return None


def handle_merge_duplicate_facilities(
    facilities: DataFrame,
) -> Tuple[DataFrame, Union[Dict[str, str], None]]:
    """Drops duplicate facilities by name and some other logic. Returns
    facility DataFrame without duplicate facilities and merged facilityIds
    as a dictionary ({from_id: to_id},...).
    """

    log(f'Facilities before merging duplicates: {len(facilities)}')

    facility_id_to_id_merge_map = _get_id_to_id_merge_map_for_facilities(
        facilities
    )
    if not facility_id_to_id_merge_map:
        return None

    # drop duplicate facilities
    facility_duplicate_ids_to_rm = facility_id_to_id_merge_map.keys()
    facilities = facilities[
        ~facilities['facilityId'].isin(facility_duplicate_ids_to_rm)
    ]
    log(f'Facilities after dropping/merging duplicates: {len(facilities)}')

    return (facilities, facility_id_to_id_merge_map)


def update_facility_ids_by_merge_map(
    releases_or_waste_transfers: DataFrame,
    facility_id_to_id_merge_map: Dict[str, str]
):
    """Updates facilityId for releases or waste transfers that are
    linked to duplicate (dropped) facilities.
    """

    releases_or_waste_transfers['facilityId'] = [
        facility_id_to_id_merge_map.get(
            facility_id, facility_id
        )
        for facility_id
        in releases_or_waste_transfers['facilityId']
    ]
