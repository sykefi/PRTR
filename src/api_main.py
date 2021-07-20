from api.models import Facility
from typing import List
from api.conf import conf
import api.models as models
import csv
from fastapi import FastAPI


facilities: List[Facility] = [
    models.facility_csv_dict_2_facility(d) for d
    in csv.DictReader(open(conf.facilities_csv_fp), delimiter=';')
]


root_path = f'/api/{conf.api_version}'

app = FastAPI(
    title=conf.api_name,
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


@app.get(f'{root_path}/facilities', response_model=List[Facility])
def get_facilities():
    return facilities[:5]
