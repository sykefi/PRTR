from models.enums import MainActivityCode, Medium, MethodCode, PollutantCode
import pytest
from models.models import (
    facility_csv_dict_2_facility, release_csv_dict_2_release
)
from pydantic import ValidationError


def test_reads_facility_from_dictionary():
    facility = facility_csv_dict_2_facility({
        'Facility_INSPIRE_ID': '123',
        'parentCompanyName': 'ABOY',
        'nameOfFeature': 'COAL',
        'mainActivityCode': '1(c)',
        'mainActivityName': 'Combustion installations',
        'pointGeometryLon': 24.6299,
        'pointGeometryLat': 24.6299,
        'streetName': 'Ruukinmestarintie 10',
        'buildingNumber': '10',
        'postalCode': '02320',
        'city': 'Espoo',
        'countryCode': 'FI',
        'telephoneNo': '12345'
    })
    assert facility.facilityInspireId == '123'
    assert facility.parentCompanyName == 'ABOY'
    assert facility.nameOfFeature == 'COAL'
    assert facility.mainActivityCode == MainActivityCode.ONE_C
    assert facility.mainActivityName == 'Combustion installations'
    assert facility.pointGeometryLon == 24.6299
    assert facility.pointGeometryLat == 24.6299
    assert facility.streetName == 'Ruukinmestarintie 10'
    assert facility.buildingNumber == '10'
    assert facility.postalCode == '02320'
    assert facility.city == 'Espoo'
    assert facility.countryCode == 'FI'
    assert facility.telephoneNo == '12345'


def test_throws_validation_error_for_invalid_facility_main_activity_code():
    with pytest.raises(ValidationError):
        facility_csv_dict_2_facility({
            'Facility_INSPIRE_ID': '123',
            'parentCompanyName': 'ABOY',
            'nameOfFeature': 'COAL',
            'mainActivityCode': 'asdf',
            'mainActivityName': 'Combustion installations',
            'pointGeometryLon': 24.6299,
            'pointGeometryLat': 24.6299,
            'streetName': 'Ruukinmestarintie 10',
            'buildingNumber': '10',
            'postalCode': '02320',
            'city': 'Espoo',
            'countryCode': 'FI',
            'telephoneNo': '12345'
        })


def test_throws_validation_error_for_facility_missing_facility_id():
    with pytest.raises(ValidationError):
        facility_csv_dict_2_facility({
            'Facility_INSPIRE_ID': None,
            'parentCompanyName': 'ABOY',
            'nameOfFeature': 'COAL',
            'mainActivityCode': '1(c)',
            'mainActivityName': 'Combustion installations',
            'pointGeometryLon': 24.6299,
            'pointGeometryLat': 24.6299,
            'streetName': 'Ruukinmestarintie 10',
            'buildingNumber': '10',
            'postalCode': '02320',
            'city': 'Espoo',
            'countryCode': 'FI',
            'telephoneNo': '12345'
        })


def test_reads_release_from_dictionary():
    release = release_csv_dict_2_release({
        'Facility_INSPIRE_ID': 'FI.EEA/11035.FACILITY',
        'reportingYear': '2015',
        'pollutantCode': 'NH3',
        'pollutantName': 'Ammonia',
        'medium': 'AIR',
        'totalPollutantQuantityKg': '11000.0',
        'AccidentalPollutantQuantityKG': '0.0',
        'methodCode': 'M',
        'methodName': 'Measured: analytical method used'
    })

    assert release.facilityInspireId == 'FI.EEA/11035.FACILITY'
    assert release.reportingYear == 2015
    assert release.pollutantCode == PollutantCode.NH3
    assert release.pollutantName == 'Ammonia'
    assert release.medium == Medium.AIR
    assert release.totalPollutantQuantityKg == 11000.0
    assert release.AccidentalPollutantQuantityKG == 0.0
    assert release.methodCode == MethodCode.M
    assert release.methodName == 'Measured: analytical method used'


def test_throws_validation_error_for_invalid_release_pollutant_code():
    with pytest.raises(ValidationError):
        release_csv_dict_2_release({
                'Facility_INSPIRE_ID': 'FI.EEA/11035.FACILITY',
                'reportingYear': '2015',
                'pollutantCode': 'NH3___',
                'pollutantName': 'Ammonia',
                'medium': 'AIR',
                'totalPollutantQuantityKg': '11000.0',
                'AccidentalPollutantQuantityKG': '0.0',
                'methodCode': 'M',
                'methodName': 'Measured: analytical method used'
            })
