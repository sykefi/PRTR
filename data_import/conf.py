import os
from dataclasses import dataclass


def __read_env_variables():
    """Reads environment variables to env from file .env.
    The expected content of the file is one name=value row per env variable.
    """
    try:
        env_file = open('.env', 'r')
        lines = env_file.read().splitlines()
        for line in lines:
            line.rstrip('\n')
            row = line.partition('=')
            key, val = (row[0], row[2])
            os.environ[key] = val
        env_file.close()
    except Exception:
        pass


def __read_required_env_var(name: str) -> str:
    prtr_db_file_path = os.getenv(name)
    if not prtr_db_file_path:
        raise EnvironmentError(
            f'Environment variable {name} needs to be set.\n'
            f'Add file .env containing at least {name}=<some_value>'
        )
    return prtr_db_file_path


__read_env_variables()


@dataclass(frozen=True)
class Conf():
    prtr_db_file_path: str
    country_code: str


conf = Conf(
    prtr_db_file_path=__read_required_env_var('PRTR_DB_FILE_PATH'),
    country_code=__read_required_env_var('COUNTRY_CODE')
)
