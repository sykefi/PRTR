[![API tests](https://github.com/sykefi/PRTR/workflows/tests/badge.svg)](https://github.com/sykefi/PRTR/actions)

# PRTR
A project for handling the European Pollutant Release and Transfer Register (E-PRTR) data and publishing it as a national web service.

E-PRTR data is available for download at [industry.eea.europa.eu/download](https://industry.eea.europa.eu/download).


## Getting Started
### Prerequisites
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or [Anaconda](https://www.anaconda.com/products/individual) package manager for Python. 

### Installation
```
$ git clone https://github.com/sykefi/PRTR.git
$ cd PRTR/app
$ conda env create -f dev-env.yml
$ conda activate prtr
```
### Data import (optional)
The data import script requires installation of [driver for MS for Access files](https://www.microsoft.com/en-us/download/details.aspx?id=54920). Adjust the [configuration](app/data_import/conf.py) if needed (filepath to .accdb data, country code etc.). Previously imported PRTR dataset for Finland is already included in the path [app/api/assets](app/api/assets) (as CSV files). 
```
$ python data_import_main.py
```

### Running the server locally
```
$ uvicorn api_main:app --reload
```

### Running the tests
```
$ python -m pytest tests/
```
