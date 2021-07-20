from dataclasses import dataclass
import common.conf as conf_utils


conf_utils.read_env_variables_from_file('data_import')


@dataclass(frozen=True)
class Conf():
    prtr_db_file_path: str
    country_code: str
    csv_out_dir: str


conf = Conf(
    prtr_db_file_path=conf_utils.read_required_env_var('PRTR_DB_FILE_PATH'),
    country_code=conf_utils.read_required_env_var('COUNTRY_CODE'),
    csv_out_dir='api/assets'
)
