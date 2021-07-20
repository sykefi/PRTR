"""
Available configurations:
    prtr_db_file_path: full file path in the filesystem to the raw PRTR data in
        .accdb file format.
    country_code: country code by which the data is filtered in the import.
    csv_out_dir: directory to which the imported data is saved in CSV format
        (facilities.csv & releases.csv)
"""


from dataclasses import dataclass
import common.conf as conf_utils


conf_utils.read_env_variables_from_env_file('data_import')


@dataclass(frozen=True)
class Conf():
    prtr_db_file_path: str
    country_code: str
    csv_out_dir: str


conf = Conf(
    prtr_db_file_path=conf_utils.read_env_var('PRTR_DB_FILE_PATH'),
    country_code=conf_utils.read_env_var('COUNTRY_CODE', default='FI'),
    csv_out_dir='api/assets'
)
