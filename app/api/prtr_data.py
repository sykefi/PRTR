from models.enums import PollutantCode
from models.models import (
    PollutantRelease, PollutantReleaseWithFacilityInfo,
    ProductionFacility, with_facility_info
)
from functools import partial
from typing import List, Union
import api.prtr_data_source as prtr_data_source
from api.conf import conf


_facilities = prtr_data_source.load_facilities(conf.facilities_csv_fp)

_facility_by_id = {f.facilityInspireId: f for f in _facilities}

_releases = prtr_data_source.load_releases(conf.releases_csv_fp)

_releases_with_facility_info: List[PollutantReleaseWithFacilityInfo] = [
    with_facility_info(r, _facility_by_id[r.facilityInspireId])
    for r in _releases
    if r.facilityInspireId in _facility_by_id
]


def get_facilities(
    facility_id: Union[str, None],
    skip: int,
    limit: int
) -> List[ProductionFacility]:
    if not facility_id:
        return _facilities[skip:skip + limit]
    match = _facility_by_id.get(facility_id, None)
    return [match] if match else []


def _filter_releases(
    facility_id: Union[str, None],
    skip: int,
    limit: int,
    reporting_year: Union[int, None],
    pollutant_code: Union[PollutantCode, None],
    releases_data: Union[
        List[PollutantRelease], List[PollutantReleaseWithFacilityInfo]
    ]
) -> Union[
    List[PollutantRelease],
    List[PollutantReleaseWithFacilityInfo]
]:
    match = [
        r for r in releases_data
        if (
            (not facility_id or r.facilityInspireId == facility_id) and
            (not pollutant_code or r.pollutantCode == pollutant_code) and
            (not reporting_year or r.reportingYear == reporting_year)
        )
    ]
    return match[skip:skip + limit]


def get_releases(
    facility_id: Union[str, None],
    skip: int,
    limit: int,
    reporting_year: Union[int, None],
    pollutant_code: Union[PollutantCode, None],
    with_facility_info: bool = False
) -> Union[
    List[PollutantRelease],
    List[PollutantReleaseWithFacilityInfo]
]:
    filter_releases = partial(
        _filter_releases,
        facility_id,
        skip,
        limit,
        reporting_year,
        pollutant_code
    )
    if not with_facility_info:
        return filter_releases(_releases)
    else:
        return filter_releases(_releases_with_facility_info)
