from typing import Optional, Union
from fastapi.params import Query
from models.enums import (
    MainActivityCode, Medium, PollutantCode, TopMainActivity
)
from models.models import (
    PRTRListResponse, PollutantRelease,
    ProductionFacility, PrtrMetadata, WasteTransfer
)
from api.conf import conf
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
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
    'http://syke-prtr-d-web.azurewebsites.net',
    'https://syke-prtr-d-web.azurewebsites.net',
    'http://syke-prtr-p-web.azurewebsites.net',
    'https://syke-prtr-p-web.azurewebsites.net',
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
    f'{root_path}/prtr-metadata',
    response_model=PrtrMetadata,
    summary='Get metadata of the available PRTR data'
)
def read_metadata():
    return prtr_data.get_metadata()


@app.get(
    f'{root_path}/facilities',
    response_model=PRTRListResponse[ProductionFacility],
    summary='Get production facilities'
)
def read_facilities(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10,
    name_search_str: str = None,
    placename: str = None,
    main_activity: Optional[Union[MainActivityCode, TopMainActivity]] = Query(
        None,
        description='Either MainActivityCode or TopMainActivity (optional).'
    )
):
    match = prtr_data.get_facilities(
        facility_id,
        skip,
        limit,
        name_search_str,
        placename,
        main_activity
    )
    if not match.data:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            'No production facilities found'
        )

    return match


@app.get(
    f'{root_path}/releases',
    response_model=PRTRListResponse[PollutantRelease],
    summary='Get pollutant releases'
)
def read_pollutant_releases(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10,
    reporting_year: int = None,
    medium: Medium = None,
    pollutant_code: PollutantCode = None,
    placename: str = None,
):
    return prtr_data.get_releases(
        facility_id,
        skip,
        limit,
        reporting_year,
        medium,
        pollutant_code,
        placename
    )


@app.get(
    f'{root_path}/waste-transfers',
    response_model=PRTRListResponse[WasteTransfer],
    summary='Get waste transfers'
)
def read_waste_transfers(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10,
    reporting_year: int = None,
):
    return prtr_data.get_waste_transfers(
        facility_id,
        skip,
        limit,
        reporting_year,
    )
