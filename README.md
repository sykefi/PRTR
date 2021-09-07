[![API: tests & deploy dev](https://github.com/sykefi/PRTR/workflows/API%3A%20tests%20%26%20deploy%20dev/badge.svg)](https://github.com/sykefi/PRTR/actions)

# PRTR-API
A project for handling the European Pollutant Release and Transfer Register (i.e. E-PRTR) data and publishing it as a national web service (API & user interface).

The development version of the API (serving only Finnish PRTR data) is published at [prtr-api-dev.azurewebsites.net](https://prtr-api-dev.azurewebsites.net/docs).

A prototype of the user interface (or portal) is published at [prtr.fi](http://prtr.fi/).

## Getting Started
### Prerequisites
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or [Anaconda](https://www.anaconda.com/products/individual) package manager for Python. 
- E-PRTR data is available for download at [industry.eea.europa.eu/download](https://industry.eea.europa.eu/download) (included as CSV files for Finland in [api/api/assets](api/api/assets)).

### Installation
```
$ git clone https://github.com/sykefi/PRTR.git
$ cd PRTR/api
$ conda env create -f dev-env.yml
$ conda activate prtr
```
### Data import (optional)
The data import script requires installation of [driver for MS for Access files](https://www.microsoft.com/en-us/download/details.aspx?id=54920). Prior to running the script, adjust the [configuration](api/data_import/conf.py) if needed (filepath to .accdb data, country code etc.). Previously imported PRTR dataset for Finland is already included as CSV files in the path [api/api/assets](api/api/assets). 
```
$ python data_import_main.py
```

### Running the server locally
```
$ uvicorn main:app --reload
```
API should now be accessible at [localhost:8000](http://localhost:8000/).

### Running the tests
```
$ python -m pytest tests/
```
