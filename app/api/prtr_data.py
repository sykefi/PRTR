from models.models import (
    Facility, FacilityCsvDict, facility_csv_dict_2_facility
)
from typing import List
import csv


def __replace_empty_strings_with_none(d: FacilityCsvDict) -> dict:
    return {k: v if v != '' else None for k, v in d.items()}


def load_facilities(facilities_fp: str) -> List[Facility]:
    return [
        facility_csv_dict_2_facility(
            __replace_empty_strings_with_none(d)
        ) for d
        in csv.DictReader(
            open(facilities_fp, encoding='utf8'), delimiter=';'
        )
    ]
