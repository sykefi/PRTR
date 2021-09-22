from pydantic.error_wrappers import ValidationError
from models.enums import (
    MainActivityCode, Medium, MethodCode, PollutantCode
)
from typing import Optional, TypedDict
from pydantic import BaseModel


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


class PollutantRelease(BaseModel):
    facilityId: str
    reportingYear: int
    pollutantCode: PollutantCode
    pollutantName: str
    medium: Medium
    totalPollutantQuantityKg: float
    AccidentalPollutantQuantityKG: float
    methodCode: MethodCode
    methodName: str


def release_csv_dict_2_release(
    csv_release: PollutantReleaseCsvDict
) -> PollutantRelease:
    try:
        return PollutantRelease(
            facilityId=csv_release['facilityId'],
            reportingYear=csv_release['reportingYear'],
            pollutantCode=csv_release['pollutantCode'],
            pollutantName=csv_release['pollutantName'],
            medium=csv_release['medium'],
            totalPollutantQuantityKg=csv_release['totalPollutantQuantityKg'],
            AccidentalPollutantQuantityKG=(
                csv_release['AccidentalPollutantQuantityKG']
            ),
            methodCode=csv_release['methodCode'],
            methodName=csv_release['methodName']
        )
    except ValidationError as e:
        print(
            f'Could not convert to PollutantRelease '
            f'from data: {csv_release}'
        )
        raise e


class PollutantReleaseWithFacilityInfo(PollutantRelease):
    facilityId: str
    parentCompanyName: str
    nameOfFeature: str
    city: Optional[str] = None
    x: float
    y: float


def with_facility_info(
    release: PollutantRelease,
    facility: ProductionFacility
) -> PollutantReleaseWithFacilityInfo:
    return PollutantReleaseWithFacilityInfo(
        **release.dict(),
        parentCompanyName=facility.parentCompanyName,
        nameOfFeature=facility.nameOfFeature,
        city=facility.city,
        x=facility.x,
        y=facility.y
    )
