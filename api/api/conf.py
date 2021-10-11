from dataclasses import dataclass


@dataclass(frozen=True)
class Conf():
    api_title: str
    api_description: str
    facilities_csv_fp: str
    releases_csv_fp: str
    waste_transfers_csv_fp: str
    api_version: str


conf = Conf(
    api_title='FIN-PRTR',
    api_description=(
        'The European Pollutant Release and Transfer Register (E-PRTR) '
        'data published as a national web service '
        '(serving only Finnish PRTR data).'
    ),
    api_version='v1',
    facilities_csv_fp=r'api/assets/facilities.csv',
    releases_csv_fp=r'api/assets/releases.csv',
    waste_transfers_csv_fp=r'api/assets/waste_transfers.csv'
)
