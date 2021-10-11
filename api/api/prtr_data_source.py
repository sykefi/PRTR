from pydantic.error_wrappers import ValidationError
import csv
from models.models import (
    BarePollutantRelease, ProductionFacility, WasteTransfer,
    facility_csv_dict_2_facility, release_csv_dict_2_release,
    waste_transfer_csv_dict_2_waste_transfer
)
from typing import Callable, List, Union


def _replace_empty_strings_with_none(d: dict) -> dict:
    return {k: v if v != '' else None for k, v in d.items()}


def _dict_to_model_or_none(
    data: dict,
    converter: Union[
        Callable[[dict], ProductionFacility],
        Callable[[dict], BarePollutantRelease]
    ]
) -> Union[Union[ProductionFacility, BarePollutantRelease], None]:
    try:
        return converter(data)
    except ValidationError as e:
        print(e)
        return None


def _log_import_errors(
    data: Union[
        List[Union[BarePollutantRelease, None]],
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


def load_releases(releases_fp: str) -> List[BarePollutantRelease]:
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


def load_waste_transfers(waste_transfers_fp: str) -> List[WasteTransfer]:
    waste_transfers = [
        _dict_to_model_or_none(
            _replace_empty_strings_with_none(d),
            waste_transfer_csv_dict_2_waste_transfer
        )
        for d in csv.DictReader(
            open(waste_transfers_fp, encoding='utf8'), delimiter=';'
        )
    ]
    _log_import_errors(waste_transfers, 'waste_transfers')
    return [wt for wt in waste_transfers if wt]
