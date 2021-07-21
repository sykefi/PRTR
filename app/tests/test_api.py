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
    }


def test_get_facilities():
    response = client.get(f'{root_path}/facilities')
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 1
