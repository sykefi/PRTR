import os


def read_env_variables_from_env_file(dir: str):
    """Reads environment variables to env from .env file located in the given
    directory (dir). The expected content of the file is one name=value row
    per env variable.
    """
    if not os.path.isfile(fr'{dir}/.env'):
        print(f'No .env file found from path: {dir}/.env')
        return

    try:
        env_file = open(fr'{dir}/.env', 'r')
        lines = env_file.read().splitlines()
        for line in lines:
            line.rstrip('\n')
            row = line.partition('=')
            key, val = (row[0], row[2])
            os.environ[key] = val
        env_file.close()
    except Exception:
        pass


def read_env_var(name: str, default='unset_env_var') -> str:
    if default != 'unset_env_var':
        return os.getenv(name, default)

    value = os.getenv(name)

    if not value:
        raise EnvironmentError(
            f'Environment variable {name} needs to be set.\n'
            f'Add file .env containing at least {name}=<some_value> '
            f'or set it as an environment variable'
        )
    return value
