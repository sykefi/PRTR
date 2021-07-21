from api.models import Facility, facility_csv_dict_2_facility
from typing import List
import csv


def __replace_empty_strings_with_none(d: dict) -> dict:
    return {k: v if v != '' else None for k, v in d.items()}


def load_facilities(facilities_fp: str) -> List[Facility]:
    facilities: List[Facility] = [
        facility_csv_dict_2_facility(
            __replace_empty_strings_with_none(d)
        ) for d
        in csv.DictReader(
            open(facilities_fp, encoding='utf8'), delimiter=';'
        )
    ]
    return facilities
