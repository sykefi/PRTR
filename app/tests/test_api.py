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


def test_get_facilities():
    response = client.get(f'{root_path}/facilities')
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 1
    for facility in body:
        assert _is_facility(facility)


def test_get_facility_by_id():
    facility_id = 'FI.EEA/11035.FACILITY'
    response = client.get(
        f'{root_path}/facilities?facility_id={facility_id}'
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    for facility in body:
        assert facility['facilityInspireId'] == facility_id
        assert _is_facility(facility)


def test_get_releases():
    response = client.get(f'{root_path}/releases')
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 1
    for release in body:
        assert _is_release(release)


def test_get_releases_by_facility_id():
    facility_id = 'FI.EEA/11035.FACILITY'
    response = client.get(
        f'{root_path}/releases?facility_id={facility_id}'
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 8
    for release in body:
        assert release['facilityInspireId'] == facility_id
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
    facility_id = 'FI.EEA/11035.FACILITY'
    response = client.get(
        f'{root_path}/releases-facilities?facility_id={facility_id}'
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 8
    for release in body:
        assert release['facilityInspireId'] == facility_id
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
