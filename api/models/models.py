from pydantic.error_wrappers import ValidationError
from models.enums import (
    MainActivityCode, Medium, MethodCode, PollutantCode
)
from typing import Dict, Optional, TypedDict
from pydantic import BaseModel


class ProductionFacilityCsvDict(TypedDict):
    Facility_INSPIRE_ID: str
    parentCompanyName: str
    nameOfFeature: str
    mainActivityCode: str
    mainActivityName: str
    pointGeometryLon: str
    pointGeometryLat: str
    streetName: str
    buildingNumber: str
    postalCode: str
    city: str
    countryCode: str
    telephoneNo: str


class ProductionFacility(BaseModel):
    facilityInspireId: str
    parentCompanyName: str
    nameOfFeature: str
    mainActivityCode: MainActivityCode
    mainActivityName: Optional[str] = None
    pointGeometryLon: float
    pointGeometryLat: float
    streetName: Optional[str] = None
    buildingNumber: Optional[str] = None
    postalCode: Optional[str] = None
    city: Optional[str] = None
    countryCode: str
    telephoneNo: Optional[str] = None


_id_cleanup: Dict[str, str] = {
    'http://paikkatiedot.fi/so/1002031/pf/ProductionInstallationPart/': '',
    'http://paikkatiedot.fi/so/1002031/pf/ProductionFacility/': '',
    '.ProductionFacility': '',
    '.FACILITY': '',
    '.': '_',
    '-': '_',
    '/': '_'
}


def _replace_all(text: str, dic: Dict[str, str]):
    for k, v in dic.items():
        text = text.replace(k, v)
    return text


def _clean_id(id_str: str) -> str:
    return _replace_all(id_str, _id_cleanup)


def facility_csv_dict_2_facility(
    csv_facility: ProductionFacilityCsvDict
) -> ProductionFacility:
    try:
        return ProductionFacility(
            facilityInspireId=_clean_id(csv_facility['Facility_INSPIRE_ID']),
            parentCompanyName=csv_facility['parentCompanyName'],
            nameOfFeature=csv_facility['nameOfFeature'],
            mainActivityCode=csv_facility['mainActivityCode'],
            mainActivityName=csv_facility['mainActivityName'],
            pointGeometryLon=csv_facility['pointGeometryLon'],
            pointGeometryLat=csv_facility['pointGeometryLat'],
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
    reportingYear: int
    pollutantCode: str
    pollutantName: str
    medium: str
    totalPollutantQuantityKg: str
    AccidentalPollutantQuantityKG: str
    methodCode: str
    methodName: str


class PollutantRelease(BaseModel):
    facilityInspireId: str
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
            facilityInspireId=_clean_id(csv_release['Facility_INSPIRE_ID']),
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
    facilityInspireId: str
    parentCompanyName: str
    nameOfFeature: str
    city: Optional[str] = None
    pointGeometryLon: float
    pointGeometryLat: float


def with_facility_info(
    release: PollutantRelease,
    facility: ProductionFacility
) -> PollutantReleaseWithFacilityInfo:
    return PollutantReleaseWithFacilityInfo(
        **release.dict(),
        parentCompanyName=facility.parentCompanyName,
        nameOfFeature=facility.nameOfFeature,
        city=facility.city,
        pointGeometryLon=facility.pointGeometryLon,
        pointGeometryLat=facility.pointGeometryLat
    )
