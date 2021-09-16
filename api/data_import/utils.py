from data_import.conf import conf
from typing import Dict
from pandas import DataFrame
import pyproj
from pyproj import CRS
from shapely.geometry import Point
from shapely.ops import transform


def _replace_all(text: str, dic: Dict[str, str]):
    for k, v in dic.items():
        text = text.replace(k, v)
    return text


project = pyproj.Transformer.from_crs(
    crs_from=CRS('epsg:4326'),
    crs_to=CRS(f'epsg:{conf.proj_crs_epsg}'),
    always_xy=True
)


def add_projected_x_y_columns(
    df: DataFrame,
    lon_col='pointGeometryLon',
    lat_col='pointGeometryLat'
) -> DataFrame:
    df['point_geom_wgs'] = df.apply(
         lambda row: Point(row[lon_col], row[lat_col]),
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


def clean_id(id_str: str) -> str:
    if not id_str:
        raise ValueError("Missing Facility ID")
    clean_id = _replace_all(id_str, _id_cleanup)
    if not clean_id:
        raise ValueError("Missing Facility ID")
    return clean_id


def validate_ids(df: DataFrame, id_col='facilityId'):
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
    print('Unique values in column "mainActivityCode":')
    for value in sorted([v for v in unique_values if v is not None]):
        enum_name = _get_main_activity_code_enum_name(value)
        print(f"    {enum_name} = '{value}'")
    print('\n')


def print_unique_values_as_enum(df: DataFrame, col: str):
    unique_values = df[col].unique()
    print(f'Unique values in column "{col}":')
    for value in sorted([v for v in unique_values if v is not None]):
        print(f"    {value} = '{value}'")
    print('\n')
