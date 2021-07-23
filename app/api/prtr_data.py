from models.models import (
    PollutantRelease, PollutantReleaseWithFacilityInfo,
    ProductionFacility, with_facility_info
)
from typing import List
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
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10
) -> List[ProductionFacility]:
    if not facility_id:
        return facilities[skip:skip + limit]

    match = facility_by_id.get(facility_id, None)
    return [match] if match else []


def get_releases(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10
) -> List[PollutantRelease]:
    if not facility_id:
        match = releases[skip:skip + limit]
    else:
        match = [r for r in releases if r.facilityInspireId == facility_id]

    return match


def get_releases_with_facility_info(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10
) -> List[PollutantReleaseWithFacilityInfo]:
    if not facility_id:
        match = releases_with_facility_info[skip:skip + limit]
    else:
        match = [
            r for r in releases_with_facility_info
            if r.facilityInspireId == facility_id
        ]

    return match
