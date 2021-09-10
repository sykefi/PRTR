from models.enums import MainActivityCode, PollutantCode
from models.models import (
    PollutantRelease, PollutantReleaseWithFacilityInfo, ProductionFacility
)
from api.conf import conf
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import api.prtr_data as prtr_data


app = FastAPI(
    title=conf.api_title,
    description=conf.api_description,
    version=conf.api_version,
    openapi_url='/openapi.json',
    docs_url='/docs'
)

origins = [
    'http://prtr-ui-dev.azurewebsites.net',
    'https://prtr-ui-dev.azurewebsites.net',
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
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
    f'{root_path}/releases',
    response_model=List[PollutantRelease],
    summary='Get pollutant releases'
)
def read_pollutant_releases(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10,
    reporting_year: int = None,
    pollutant_code: PollutantCode = None
):
    match = prtr_data.get_releases(
        facility_id,
        skip,
        limit,
        reporting_year,
        pollutant_code,
        with_facility_info=False
    )
    if not match:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            'No pollutant releases found'
        )
    return match


@app.get(
    f'{root_path}/releases-facilities',
    response_model=List[PollutantReleaseWithFacilityInfo],
    summary=(
        'Get pollutant releases with related '
        'production facility infomation'
    )
)
def read_pollutant_releases_with_facility_info(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10,
    reporting_year: int = None,
    pollutant_code: PollutantCode = None
):
    match = prtr_data.get_releases(
        facility_id,
        skip,
        limit,
        reporting_year,
        pollutant_code,
        with_facility_info=True
    )
    if not match:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            'No pollutant releases found'
        )
    return match


@app.get(
    f'{root_path}/facilities',
    response_model=List[ProductionFacility],
    summary='Get production facilities'
)
def read_production_facilities(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10,
    name_search_str: str = None,
    main_activity_code: MainActivityCode = None
):
    match = prtr_data.get_facilities(
        facility_id,
        skip,
        limit,
        name_search_str,
        main_activity_code
    )
    if not match:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            'No production facilities found'
        )

    return match
