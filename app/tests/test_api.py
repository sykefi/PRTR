from fastapi.testclient import TestClient
from main import app, root_path
from api.conf import conf


client = TestClient(app)


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


def test_get_releases():
    response = client.get(f'{root_path}/releases')
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 1


def test_get_releases_by_facility():
    facility_id = 'FI.EEA/11035.FACILITY'
    response = client.get(
        f'{root_path}/releases?facility_id={facility_id}'
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 1
    for release in body:
        assert release['facilityInspireId'] == facility_id
