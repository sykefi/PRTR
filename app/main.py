from api.models import Facility
from api.conf import conf
from fastapi import FastAPI, HTTPException, status
from typing import List
import api.data as data


facilities = data.load_facilities(conf.facilities_csv_fp)


root_path = f'/api/{conf.api_version}'


app = FastAPI(
    title=conf.api_title,
    description=conf.api_description,
    version=conf.api_version,
    openapi_url=f'{root_path}/openapi.json',
    docs_url=f'{root_path}/docs'
)


@app.get('/')
def read_root():
    return {
        'title': app.title,
        'description': app.description,
        'documentation': app.docs_url,
    }


@app.get(
    f'{root_path}/facilities',
    response_model=List[Facility],
    status_code=200
)
def read_facilities(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10
):
    if not facility_id:
        return facilities[skip:skip + limit]

    match = [f for f in facilities if f.facilityInspireId == facility_id]
    if not match:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'Facility not found')

    return match
