from models.enums import MainActivityCode, Medium, PollutantCode
from models.models import (
    PRTRListResponse, PollutantRelease,
    ProductionFacility, PrtrMetadata, with_facility_info
)
from typing import List, Union
import api.prtr_data_source as prtr_data_source
from api.conf import conf


_facilities = prtr_data_source.load_facilities(conf.facilities_csv_fp)

_facility_by_id = {f.facilityId: f for f in _facilities}

_bare_releases = prtr_data_source.load_releases(conf.releases_csv_fp)

fuzzy_releases_count = len([
    r for r in _bare_releases if r.facilityId not in _facility_by_id
])
if fuzzy_releases_count > 0:
    raise ValueError('Some of the releases are not linked to facilities')

_releases: List[PollutantRelease] = [
    with_facility_info(r, _facility_by_id[r.facilityId])
    for r in _bare_releases
    if r.facilityId in _facility_by_id
]

_metadata = PrtrMetadata(
    available_reporting_years=list(set([r.reportingYear for r in _releases])),
    present_pollutant_codes=list(set([r.pollutantCode for r in _releases])),
    present_cities=list(set([
        f.city for f in _facilities if f.city is not None
    ])),
    present_main_activity_codes=list(set([
        f.mainActivityCode for f in _facilities
    ])),
)


def get_metadata() -> PrtrMetadata:
    return _metadata


def get_facilities(
    facility_id: Union[str, None],
    skip: int,
    limit: int,
    name_search: Union[str, None],
    main_activity_code: Union[MainActivityCode, None]
) -> PRTRListResponse[ProductionFacility]:

    if facility_id:
        if facility_id in _facility_by_id:
            match = [_facility_by_id[facility_id]]
        else:
            match = []
        return PRTRListResponse[ProductionFacility](
            data=match,
            count=len(match),
            skipped=0,
            limit=1
        )

    name_search_str: Union[str, None] = (
        name_search.lower() if name_search else None
    )

    match = [
        f for f in _facilities
        if (
            (
                not name_search_str
                or name_search_str in f.nameOfFeature.lower()
                or name_search_str in f.parentCompanyName.lower()
            )
            and
            (
                not main_activity_code
                or f.mainActivityCode == main_activity_code
            )
        )
    ]

    return PRTRListResponse[ProductionFacility](
        data=match[skip:skip + limit],
        count=len(match),
        skipped=skip,
        limit=limit
    )


def get_releases(
    facility_id: Union[str, None],
    skip: int,
    limit: int,
    reporting_year: Union[int, None],
    medium: Union[Medium, None],
    pollutant_code: Union[PollutantCode, None]
) -> PRTRListResponse[PollutantRelease]:
    match = [
        r for r in _releases
        if (
            (not facility_id or r.facilityId == facility_id) and
            (not reporting_year or r.reportingYear == reporting_year) and
            (not medium or r.medium == medium) and
            (not pollutant_code or r.pollutantCode == pollutant_code)
        )
    ]
    return PRTRListResponse(
        data=match[skip:skip + limit],
        count=len(match),
        skipped=skip,
        limit=limit
    )
