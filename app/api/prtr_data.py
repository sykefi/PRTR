from pydantic.error_wrappers import ValidationError
import csv
from models.models import (
    Facility, FacilityCsvDict, facility_csv_dict_2_facility
)
from typing import List, Union


def _replace_empty_strings_with_none(d: FacilityCsvDict) -> dict:
    return {k: v if v != '' else None for k, v in d.items()}


def _facility_csv_dict_2_facility(
    csv_facility: FacilityCsvDict
) -> Union[Facility, None]:
    try:
        return facility_csv_dict_2_facility(csv_facility)
    except ValidationError as e:
        print(e)
        return None


def load_facilities(facilities_fp: str) -> List[Facility]:
    facilities = [
        _facility_csv_dict_2_facility(
            _replace_empty_strings_with_none(d)
        )
        for d
        in csv.DictReader(
            open(facilities_fp, encoding='utf8'), delimiter=';'
        )
    ]

    import_errors = len([f for f in facilities if not f])
    if import_errors:
        print(
            f'Could not read {len(import_errors)} '
            f'of {len(facilities)} facilities.'
        )

    return [f for f in facilities if f]
