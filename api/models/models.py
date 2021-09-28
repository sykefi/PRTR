from pydantic.error_wrappers import ValidationError
from models.enums import (
    MainActivityCode, Medium, MethodCode, PollutantCode
)
from typing import List, Optional, TypedDict, Generic, TypeVar
from pydantic import BaseModel
from pydantic.generics import GenericModel


class PrtrMetadata(BaseModel):
    available_reporting_years: List[int]
    present_pollutant_codes: List[PollutantCode]
    present_cities: List[str]
    present_main_activity_codes: List[MainActivityCode]


ResponseItemType = TypeVar('ResponseItemType')


class PRTRListResponse(GenericModel, Generic[ResponseItemType]):
    data: List[ResponseItemType]
    count: int
    skipped: int
    limit: int


class ProductionFacilityCsvDict(TypedDict):
    Facility_INSPIRE_ID: str
    facilityId: str
    parentCompanyName: str
    nameOfFeature: str
    mainActivityCode: str
    mainActivityName: str
    pointGeometryLon: str
    pointGeometryLat: str
    x: str
    y: str
    streetName: str
    buildingNumber: str
    postalCode: str
    city: str
    countryCode: str
    telephoneNo: str


class ProductionFacility(BaseModel):
    facilityId: str
    parentCompanyName: str
    nameOfFeature: str
    mainActivityCode: MainActivityCode
    x: int
    y: int
    streetName: Optional[str] = None
    buildingNumber: Optional[str] = None
    postalCode: Optional[str] = None
    city: Optional[str] = None
    countryCode: str
    telephoneNo: Optional[str] = None


def facility_csv_dict_2_facility(
    csv_facility: ProductionFacilityCsvDict
) -> ProductionFacility:
    try:
        return ProductionFacility(
            facilityId=csv_facility['facilityId'],
            parentCompanyName=csv_facility['parentCompanyName'],
            nameOfFeature=csv_facility['nameOfFeature'],
            mainActivityCode=csv_facility['mainActivityCode'],
            x=csv_facility['x'],
            y=csv_facility['y'],
            streetName=csv_facility['streetName'],
            buildingNumber=csv_facility['buildingNumber'],
            postalCode=csv_facility['postalCode'],
            city=(
                csv_facility['city'].capitalize()
                if csv_facility['city'] else None
            ),
            countryCode=csv_facility['countryCode'],
            telephoneNo=csv_facility['telephoneNo']
        )
    except ValidationError as e:
        print(
            f'Could not convert to ProductionFacility '
            f'from data: {csv_facility}'
        )
        raise e


class PollutantReleaseCsvDict(TypedDict):
    facilityInspireId: str
    facilityId: str
    reportingYear: int
    pollutantCode: str
    pollutantName: str
    medium: str
    totalPollutantQuantityKg: str
    AccidentalPollutantQuantityKG: str
    methodCode: str
    methodName: str


class BarePollutantRelease(BaseModel):
    facilityId: str
    reportingYear: int
    pollutantCode: PollutantCode
    medium: Medium
    totalPollutantQuantityKg: float
    AccidentalPollutantQuantityKG: float
    methodCode: MethodCode


def release_csv_dict_2_release(
    csv_release: PollutantReleaseCsvDict
) -> BarePollutantRelease:
    try:
        return BarePollutantRelease(
            facilityId=csv_release['facilityId'],
            reportingYear=csv_release['reportingYear'],
            pollutantCode=csv_release['pollutantCode'],
            medium=csv_release['medium'],
            totalPollutantQuantityKg=csv_release['totalPollutantQuantityKg'],
            AccidentalPollutantQuantityKG=(
                csv_release['AccidentalPollutantQuantityKG']
            ),
            methodCode=csv_release['methodCode']
        )
    except ValidationError as e:
        print(
            f'Could not convert to PollutantRelease '
            f'from data: {csv_release}'
        )
        raise e


class PollutantRelease(BarePollutantRelease):
    parentCompanyName: str
    nameOfFeature: str
    city: Optional[str] = None
    x: float
    y: float


def with_facility_info(
    release: BarePollutantRelease,
    facility: ProductionFacility
) -> PollutantRelease:
    return PollutantRelease(
        **release.dict(),
        parentCompanyName=facility.parentCompanyName,
        nameOfFeature=facility.nameOfFeature,
        city=facility.city,
        x=facility.x,
        y=facility.y
    )
