from models.enums import MainActivityCode
from fastapi.testclient import TestClient
from main import app, root_path
from api.conf import conf


client = TestClient(app)


def _has_facility_fields(data: dict) -> bool:
    parent_company_name = data.get('nameOfFeature', None)
    return parent_company_name is not None


def _has_release_fields(data: dict) -> bool:
    pollutantCode = data.get('pollutantCode', None)
    return pollutantCode is not None


def _has_waste_transfer_fields(data: dict) -> bool:
    waste_class = data.get('wasteClassificationCode', None)
    return waste_class is not None


def test_root_response():
    response = client.get('/')
    assert response.status_code == 200
    assert response.json() == {
        'title': conf.api_title,
        'description': conf.api_description,
        'documentation': app.docs_url,
        'openapi_url': app.openapi_url
    }


def test_get_metadata():
    response = client.get(f'{root_path}/prtr-metadata')
    assert response.status_code == 200
    body = response.json()
    assert len(body['available_reporting_years']) > 5
    assert body['available_reporting_years'][0] > 1900
    assert len(body['present_pollutant_codes']) > 40
    assert isinstance(body['present_pollutant_codes'][0], str)
    assert len(body['present_main_activity_codes']) > 40
    assert isinstance(body['present_main_activity_codes'][0], str)
    assert len(body['present_cities']) > 250
    assert isinstance(body['present_cities'][0], str)


def test_get_facilities():
    response = client.get(f'{root_path}/facilities')
    assert response.status_code == 200
    data = response.json()['data']
    assert len(data) > 1
    for facility in data:
        assert _has_facility_fields(facility)


def test_get_facility_by_id():
    facility_id = 'FI_EEA_11035'
    response = client.get(
        f'{root_path}/facilities?facility_id={facility_id}'
    )
    assert response.status_code == 200
    data = response.json()['data']
    assert len(data) == 1
    for facility in data:
        assert facility['facilityId'] == facility_id
        assert _has_facility_fields(facility)


def test_get_facility_by_name():
    name_search = 'Sappi Finland I Oy, Kankaan tehdas'
    response = client.get(
        f'{root_path}/facilities?name_search_str={name_search}'
    )
    assert response.status_code == 200
    data = response.json()['data']
    assert len(data) == 1
    for facility in data:
        assert name_search in facility['nameOfFeature']


def test_get_facility_by_main_activity_type():
    main_activity = MainActivityCode.ONE_A
    response = client.get(
        f'{root_path}/facilities?main_activity={main_activity.value}'
    )
    assert response.status_code == 200
    data = response.json()['data']
    assert len(data) > 1
    for facility in data:
        assert facility['mainActivityCode'] == main_activity.value


def test_get_releases():
    response = client.get(f'{root_path}/releases')
    assert response.status_code == 200
    data = response.json()['data']
    assert len(data) > 1
    for release in data:
        assert _has_release_fields(release)
        assert _has_facility_fields(release)


def test_get_releases_by_facility_id():
    facility_id = 'FI_EEA_6347'
    response = client.get(
        f'{root_path}/releases?facility_id={facility_id}'
    )
    assert response.status_code == 200
    data = response.json()['data']
    assert len(data) == 10
    release_prev = None
    for release in data:
        assert release['facilityId'] == facility_id
        assert _has_release_fields(release)
        assert _has_facility_fields(release)
        if release_prev:
            assert release['pollutantCode'] >= release_prev['pollutantCode']
        release_prev = release


def test_get_releases_by_year():
    year = 2010
    response = client.get(
        f'{root_path}/releases?reporting_year={year}'
    )
    data = response.json()['data']
    assert len(data) > 1
    for release in data:
        assert release['reportingYear'] == year


def test_get_releases_by_pollutant_code():
    pollutant_code = 'CH4'
    response = client.get(
        f'{root_path}/releases?pollutant_code={pollutant_code}'
    )
    data = response.json()['data']
    assert len(data) > 1
    for release in data:
        assert release['pollutantCode'] == pollutant_code


def test_get_waste_transfers():
    response = client.get(f'{root_path}/waste-transfers')
    assert response.status_code == 200
    data = response.json()['data']
    assert len(data) > 1
    for wt in data:
        assert _has_waste_transfer_fields(wt)


def test_get_waste_transfers_by_facility_id():
    facility_id = 'FI_EEA_11035'
    response = client.get(
        f'{root_path}/waste-transfers?facility_id={facility_id}'
    )
    data = response.json()['data']
    assert len(data) > 1
    for wt in data:
        assert _has_waste_transfer_fields(wt)
        assert wt['facilityId'] == facility_id


def test_get_waste_transfers_by_year():
    year = 2018
    response = client.get(
        f'{root_path}/waste-transfers?reporting_year={year}'
    )
    data = response.json()['data']
    assert len(data) > 1
    for wt in data:
        assert _has_waste_transfer_fields(wt)
        assert wt['reportingYear'] == year


def test_get_waste_transfers_by_all_or_international_filter():
    all_or_international_filter = 'International'
    response = client.get(
        f'{root_path}/waste-transfers?all_or_international_filter={all_or_international_filter}'
    )
    data = response.json()['data']
    assert len(data) > 1
    for wt in data:
        assert _has_waste_transfer_fields(wt)
        assert (wt['nameOfReceiver'] is not None or wt['receivingSiteCity'] is not None)


def test_get_waste_transfers_by_placename():
    placename = 'Lohja'
    response = client.get(
        f'{root_path}/waste-transfers?placename={placename}'
    )
    data = response.json()['data']
    assert len(data) > 1
    for wt in data:
        assert _has_waste_transfer_fields(wt)
        assert wt['city'] == placename