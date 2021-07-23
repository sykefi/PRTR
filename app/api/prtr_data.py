from models.models import (
    PollutantRelease, PollutantReleaseWithFacilityInfo,
    ProductionFacility, with_facility_info
)
from typing import List, Union
import api.prtr_data_source as prtr_data_source
from api.conf import conf


facilities = prtr_data_source.load_facilities(conf.facilities_csv_fp)

facility_by_id = {f.facilityInspireId: f for f in facilities}

releases = prtr_data_source.load_releases(conf.releases_csv_fp)

releases_with_facility_info: List[PollutantReleaseWithFacilityInfo] = [
    with_facility_info(r, facility_by_id[r.facilityInspireId])
    for r in releases
    if r.facilityInspireId in facility_by_id
]


def get_facilities(
    facility_id: Union[str, None],
    skip: int,
    limit: int
) -> List[ProductionFacility]:
    if not facility_id:
        return facilities[skip:skip + limit]
    match = facility_by_id.get(facility_id, None)
    return [match] if match else []


def _get_releases(
    releases_data: List[PollutantRelease],
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10,
    reporting_year: int = None,
) -> Union[List[PollutantRelease], List[PollutantReleaseWithFacilityInfo]]:
    match = [
        r for r in releases_data
        if (
            (not facility_id or r.facilityInspireId == facility_id) and
            (not reporting_year or r.reportingYear == reporting_year)
        )
    ]
    return match[skip:skip + limit]


def get_releases(
    facility_id: Union[str, None],
    skip: int,
    limit: int,
    reporting_year: Union[int, None],
    with_facility_info: bool = False
) -> Union[
    List[PollutantRelease],
    List[PollutantReleaseWithFacilityInfo]
]:
    if not with_facility_info:
        return _get_releases(
            releases, facility_id, skip, limit, reporting_year
        )
    else:
        return _get_releases(
            releases_with_facility_info,
            facility_id, skip, limit, reporting_year
        )
