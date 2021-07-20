from fastapi.testclient import TestClient
from api_main import app
from api.conf import conf


client = TestClient(app)


def test_root_response():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        'title': conf.api_title,
        'description': conf.api_description,
        'documentation': app.docs_url,
    }
