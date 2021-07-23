from pydantic.error_wrappers import ValidationError
import csv
from models.models import (
    PollutantRelease, ProductionFacility,
    facility_csv_dict_2_facility, release_csv_dict_2_release
)
from typing import Callable, List, Union


def _replace_empty_strings_with_none(d: dict) -> dict:
    return {k: v if v != '' else None for k, v in d.items()}


def _dict_to_model_or_none(
    data: dict,
    converter: Union[
        Callable[[dict], ProductionFacility],
        Callable[[dict], PollutantRelease]
    ]
) -> Union[Union[ProductionFacility, PollutantRelease], None]:
    try:
        return converter(data)
    except ValidationError as e:
        print(e)
        return None


def _log_import_errors(
    data: Union[
        List[Union[PollutantRelease, None]],
        List[Union[ProductionFacility, None]]
    ],
    data_name: str
) -> None:
    import_errors = [d for d in data if not d]
    if import_errors:
        print(
            f'Could not read {len(import_errors)} '
            f'of {len(data)} {data_name}.'
        )


def load_facilities(facilities_fp: str) -> List[ProductionFacility]:
    facilities = [
        _dict_to_model_or_none(
            _replace_empty_strings_with_none(d),
            facility_csv_dict_2_facility
        )
        for d in csv.DictReader(
            open(facilities_fp, encoding='utf8'), delimiter=';'
        )
    ]
    _log_import_errors(facilities, 'facilities')
    return [f for f in facilities if f]


def load_releases(releases_fp: str) -> List[PollutantRelease]:
    releases = [
        _dict_to_model_or_none(
            _replace_empty_strings_with_none(d),
            release_csv_dict_2_release
        )
        for d in csv.DictReader(
            open(releases_fp, encoding='utf8'), delimiter=';'
        )
    ]
    _log_import_errors(releases, 'releases')
    return [f for f in releases if f]
