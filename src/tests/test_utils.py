from api.models import facility_csv_dict_2_facility


def test_reads_facility_from_dictionary():
    d = {
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
    }

    facility = facility_csv_dict_2_facility(d)
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
