from pydantic.error_wrappers import ValidationError
from models.enums import FacilityMainActivityCode
from typing import Optional, TypedDict
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
    mainActivityCode: FacilityMainActivityCode
    mainActivityName: Optional[str] = None
    pointGeometryLon: float
    pointGeometryLat: float
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
            facilityInspireId=csv_facility['Facility_INSPIRE_ID'],
            parentCompanyName=csv_facility['parentCompanyName'],
            nameOfFeature=csv_facility['nameOfFeature'],
            mainActivityCode=csv_facility['mainActivityCode'],
            mainActivityName=csv_facility['mainActivityName'],
            pointGeometryLon=csv_facility['pointGeometryLon'],
            pointGeometryLat=csv_facility['pointGeometryLat'],
            streetName=csv_facility['streetName'],
            buildingNumber=csv_facility['buildingNumber'],
            postalCode=csv_facility['postalCode'],
            city=csv_facility['city'],
            countryCode=csv_facility['countryCode'],
            telephoneNo=csv_facility['telephoneNo']
        )
    except ValidationError as e:
        print(f'Could not create Facility from data: {csv_facility}')
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
    Facility_INSPIRE_ID: str
    reportingYear: str
    pollutantCode: str
    pollutantName: str
    medium: str
    totalPollutantQuantityKg: str
    AccidentalPollutantQuantityKG: str
    methodCode: str
    methodName: str
