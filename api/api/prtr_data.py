from models.enums import (
    MainActivityCode, Medium, PollutantCode, TopMainActivity, WasteInternationality
)
from models.models import (
    PRTRListResponse, PollutantRelease, ProductionFacility,
    PrtrMetadata, WasteTransfer, with_facility_info
)
from typing import List, Union
import api.prtr_data_source as prtr_data_source
from api.conf import conf


_facilities = sorted(
    prtr_data_source.load_facilities(conf.facilities_csv_fp),
    key=lambda f: f.nameOfFeature
)

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

_waste_transfers: List[WasteTransfer] = sorted(
    prtr_data_source.load_waste_transfers(conf.waste_transfers_csv_fp),
    key=lambda wt: (-wt.reportingYear, -wt.totalWasteQuantityTNE)
)

_metadata = PrtrMetadata(
    available_reporting_years=sorted(
        list(set([r.reportingYear for r in _releases])),
        reverse=True
    ),
    present_pollutant_codes=list(set([r.pollutantCode for r in _releases])),
    present_cities=sorted(list(set([
        f.city for f in _facilities if f.city is not None
    ]))),
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
    placename: Union[str, None],
    main_activity: Union[MainActivityCode, TopMainActivity, None]
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
                not placename
                or (
                    f.city
                    and
                    placename.lower() == f.city.lower()
                )
            )
            and
            (
                not main_activity
                or f.topMainActivity == main_activity
                or f.mainActivityCode == main_activity
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
    pollutant_code: Union[PollutantCode, None],
    placename: Union[str, None],
    sort_key: Union[str, None],
    descending: bool
) -> PRTRListResponse[PollutantRelease]:
    if sort_key is None:
        sort_key = lambda r: r.pollutantCode
    elif sort_key == "year":
        sort_key = lambda r: r.reportingYear
    elif sort_key == "quantity":
        sort_key = lambda r: r.totalPollutantQuantityKg
    elif sort_key == "pollutant":
        sort_key = lambda r: r.pollutantCode
    elif sort_key == "facility":
        sort_key = lambda r: r.nameOfFeature
    elif sort_key == "method":
        sort_key = lambda r: r.methodCode
    else:
        sort_key = lambda r: r.pollutantCode

    match = sorted([
            r for r in _releases
            if (
                (not facility_id or r.facilityId == facility_id) and
                (not reporting_year or r.reportingYear == reporting_year) and
                (not medium or r.medium == medium) and
                (not pollutant_code or r.pollutantCode == pollutant_code) and
                (not placename or r.city == placename)
            )
        ],
        key=sort_key,
        reverse=descending
    )
    return PRTRListResponse(
        data=match[skip:skip + limit],
        count=len(match),
        skipped=skip,
        limit=limit
    )


def waste_is_international(
    name_of_receiver: Union[str, None],
    receiving_site_country_name: Union[str, None]
) -> bool:
    if name_of_receiver or receiving_site_country_name:
        return True
    return False


def get_waste_transfers(
    facility_id: Union[str, None],
    skip: int,
    limit: int,
    reporting_year: Union[int, None],
    all_or_international_filter: Union[WasteInternationality, None],
    placename: Union[str, None],
    sort_key: Union[str, None],
    descending: bool
) -> PRTRListResponse[WasteTransfer]:
    if sort_key == None:
        sort_key = lambda wt: wt.nameOfFeature
    elif sort_key == 'facility':
        sort_key = lambda wt: wt.nameOfFeature
    elif sort_key == 'place':
        sort_key = lambda wt: (wt.city is None, wt.city) #Deals with empty fields in the data (sets None values to last in list)
    elif sort_key == 'classification':
        sort_key = lambda wt: wt.wasteClassificationCode
    elif sort_key == 'year':
        sort_key = lambda wt: wt.reportingYear
    elif sort_key == 'quantity':
        sort_key = lambda wt: wt.totalWasteQuantityTNE
    elif sort_key == 'treatment':
        sort_key = lambda wt: wt.wasteTreatmentCode
    elif sort_key == 'receiver':
        sort_key = lambda wt: (wt.nameOfReceiver is None, wt.nameOfReceiver) #Deals with empty fields in the data (sets None values to last in list)
    else:
        sort_key = lambda wt: wt.nameOfFeature
    match = sorted([
            wt for wt in _waste_transfers
            if (
                (not facility_id or wt.facilityId == facility_id) and
                (not reporting_year or wt.reportingYear == reporting_year) and
                (
                    not all_or_international_filter
                    or all_or_international_filter == WasteInternationality.ALL
                    or (all_or_international_filter == WasteInternationality.INTERNATIONAL and
                        waste_is_international(wt.nameOfReceiver, wt.receivingSiteCountryName))
                ) and
                (not placename or wt.city == placename)
            )
        ],
        key=sort_key,
        reverse=descending
        )

    return PRTRListResponse(
        data=match[skip:skip + limit],
        count=len(match),
        skipped=skip,
        limit=limit
    )
