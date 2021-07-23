from models.models import PollutantRelease, ProductionFacility
from api.conf import conf
from fastapi import FastAPI, HTTPException, status
from typing import List
import api.facilities as facilities
import api.releases as releases


app = FastAPI(
    title=conf.api_title,
    description=conf.api_description,
    version=conf.api_version,
    openapi_url='/openapi.json',
    docs_url='/docs'
)


@app.get('/')
def root():
    return {
        'title': app.title,
        'description': app.description,
        'documentation': app.docs_url,
        'openapi_url': app.openapi_url
    }


root_path = f'/api/{conf.api_version}'


@app.get(
    f'{root_path}/facilities',
    response_model=List[ProductionFacility],
    summary='Get production facilities'
)
def read_production_facilities(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10
):
    match = facilities.get_facilities(facility_id, skip, limit)
    if not match:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, 
            'No production facilities found'
        )

    return match


@app.get(
    f'{root_path}/releases',
    response_model=List[PollutantRelease],
    summary='Get pollutant releases'
)
def read_pollutant_releases(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10
):
    match = releases.get_releases(facility_id, skip, limit)
    if not match:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            'No pollutant releases found'
        )

    return match
