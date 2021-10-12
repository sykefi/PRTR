from pydantic.error_wrappers import ValidationError
from models.enums import (
    MainActivityCode, Medium, MethodCode, PollutantCode, TopMainActivity,
    FacilityStatus, WasteClassificationCode, WasteTreatmentCode
)
from typing import List, Optional, TypedDict, Generic, TypeVar, Union
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
    status: str


class ProductionFacility(BaseModel):
    facilityId: str
    parentCompanyName: str
    nameOfFeature: str
    topMainActivity: TopMainActivity
    mainActivityCode: MainActivityCode
    x: int
    y: int
    streetName: Optional[str] = None
    buildingNumber: Optional[str] = None
    postalCode: Optional[str] = None
    city: Optional[str] = None
    telephoneNo: Optional[str] = None
    status: Optional[FacilityStatus] = None


def _parseTopMainActivity(
    mainActivityCode: Union[MainActivityCode, str]
) -> Union[TopMainActivity, str]:
    if mainActivityCode == MainActivityCode.MISSING:
        return TopMainActivity.MISSING
    return mainActivityCode[:1]


def facility_csv_dict_2_facility(
    csv_facility: ProductionFacilityCsvDict
) -> ProductionFacility:
    try:
        return ProductionFacility(
            facilityId=csv_facility['facilityId'],
            parentCompanyName=csv_facility['parentCompanyName'],
            nameOfFeature=csv_facility['nameOfFeature'],
            topMainActivity=_parseTopMainActivity(
                csv_facility['mainActivityCode']
            ),
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
            telephoneNo=csv_facility['telephoneNo'],
            status=csv_facility['status']
        )
    except ValidationError as e:
        print(
            f'Could not create ProductionFacility object from {csv_facility}'
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
            f'Could not create PollutantRelease object from {csv_release}'
        )
        raise e


class PollutantRelease(BarePollutantRelease):
    nameOfFeature: str
    city: Optional[str] = None


def with_facility_info(
    release: BarePollutantRelease,
    facility: ProductionFacility
) -> PollutantRelease:
    return PollutantRelease(
        **release.dict(),
        nameOfFeature=facility.nameOfFeature,
        city=facility.city
    )


class WasteTransferCsvDict(TypedDict):
    Facility_INSPIRE_ID: str
    reportingYear: str
    nameOfFeature: str
    mainActivityCode: str
    mainActivityName: str
    city: str
    wasteClassificationCode: str
    wasteClassificationName: str
    wasteTreatmentCode: str
    wasteTreatmentName: str
    totalWasteQuantityTNE: str
    methodCode: str
    methodName: str
    nameOfReceiver: str
    ReceivingSite_city: str
    ReceivingSite_postalCode: str
    ReceivingSite_countryName: str
    facilityId: str


class WasteTransfer(BaseModel):
    facilityId: str
    reportingYear: int
    nameOfFeature: str
    topMainActivity: TopMainActivity
    mainActivityCode: MainActivityCode
    city: Optional[str] = None
    wasteClassificationCode: WasteClassificationCode
    wasteTreatmentCode: WasteTreatmentCode
    totalWasteQuantityTNE: float
    methodCode: MethodCode
    nameOfReceiver: Optional[str] = None
    receivingSiteCity: Optional[str] = None
    receivingSiteCountryName: Optional[str] = None


def waste_transfer_csv_dict_2_waste_transfer(
    csv_wt: WasteTransferCsvDict
) -> WasteTransfer:
    try:
        return WasteTransfer(
            facilityId=csv_wt['facilityId'],
            reportingYear=csv_wt['reportingYear'],
            nameOfFeature=csv_wt['nameOfFeature'],
            topMainActivity=_parseTopMainActivity(
                csv_wt['mainActivityCode']
            ),
            mainActivityCode=csv_wt['mainActivityCode'],
            city=(
                csv_wt['city'].capitalize()
                if csv_wt['city'] else None
            ),
            wasteClassificationCode=csv_wt['wasteClassificationCode'],
            wasteTreatmentCode=csv_wt['wasteTreatmentCode'],
            totalWasteQuantityTNE=csv_wt['totalWasteQuantityTNE'],
            methodCode=csv_wt['methodCode'],
            nameOfReceiver=csv_wt['nameOfReceiver'],
            receivingSiteCity=csv_wt['ReceivingSite_city'],
            receivingSiteCountryName=csv_wt['ReceivingSite_countryName']
        )
    except ValidationError as e:
        print(
            f'Could not create WasteTransfer object from {csv_wt}'
        )
        raise e
