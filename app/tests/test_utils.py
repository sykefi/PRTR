import pytest
from models.models import facility_csv_dict_2_facility
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
    assert facility.mainActivityCode == '1(c)'
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


def test_throws_validation_error_for_missing_facility_id():
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
