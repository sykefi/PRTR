from dataclasses import dataclass


@dataclass(frozen=True)
class Conf():
    api_name: str
    api_description: str
    facilities_csv_fp: str
    releases_csv_fp: str
    api_version: str


conf = Conf(
    api_name='FIN-PRTR',
    api_description=(
        'The European Pollutant Release and Transfer Register (E-PRTR) '
        'data published as a national web service.'
    ),
    api_version='v1',
    facilities_csv_fp='api/assets/facilities.csv',
    releases_csv_fp='api/assets/releases.csv'
)
