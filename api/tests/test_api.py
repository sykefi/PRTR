from models.enums import MainActivityCode
from fastapi.testclient import TestClient
from main import app, root_path
from api.conf import conf


client = TestClient(app)


def _is_facility(data: dict) -> bool:
    parent_company_name = data.get('parentCompanyName', None)
    return parent_company_name is not None


def _is_release(data: dict) -> bool:
    pollutantCode = data.get('pollutantCode', None)
    return pollutantCode is not None


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
    assert len(body['present_cities']) > 300
    assert isinstance(body['present_cities'][0], str)


def test_get_facilities():
    response = client.get(f'{root_path}/facilities')
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 1
    for facility in body:
        assert _is_facility(facility)


def test_get_facility_by_id():
    facility_id = 'FI_EEA_11035'
    response = client.get(
        f'{root_path}/facilities?facility_id={facility_id}'
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    for facility in body:
        assert facility['facilityId'] == facility_id
        assert _is_facility(facility)


def test_get_facility_by_name():
    name_search = 'Tuulilasintien lajittelulaitos'
    response = client.get(
        f'{root_path}/facilities?name_search_str={name_search}'
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    for facility in body:
        assert name_search in facility['nameOfFeature']


def test_get_facility_by_main_activity_type():
    main_activity = MainActivityCode.ONE_A
    response = client.get(
        f'{root_path}/facilities?main_activity_code={main_activity.value}'
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 1
    for facility in body:
        assert facility['mainActivityCode'] == main_activity.value


def test_get_releases():
    response = client.get(f'{root_path}/releases')
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 1
    for release in body:
        assert _is_release(release)


def test_get_releases_by_facility_id():
    facility_id = 'FI_EEA_11035'
    response = client.get(
        f'{root_path}/releases?facility_id={facility_id}'
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 8
    for release in body:
        assert release['facilityId'] == facility_id
        assert _is_release(release)


def test_get_releases_with_facility_info():
    response = client.get(f'{root_path}/releases-facilities')
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 1
    for release in body:
        assert _is_release(release)
        assert _is_facility(release)


def test_get_releases_with_facility_info_by_facility_id():
    facility_id = 'FI_EEA_11035'
    response = client.get(
        f'{root_path}/releases-facilities?facility_id={facility_id}'
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 8
    for release in body:
        assert release['facilityId'] == facility_id
        assert _is_release(release)
        assert _is_facility(release)


def test_get_releases_by_year():
    year = 2010
    response = client.get(
        f'{root_path}/releases-facilities?reporting_year={year}'
    )
    body = response.json()
    assert len(body) > 1
    for release in body:
        assert release['reportingYear'] == year


def test_get_releases_by_pollutant_code():
    pollutant_code = 'CH4'
    response = client.get(
        f'{root_path}/releases-facilities?pollutant_code={pollutant_code}'
    )
    body = response.json()
    assert len(body) > 1
    for release in body:
        assert release['pollutantCode'] == pollutant_code
