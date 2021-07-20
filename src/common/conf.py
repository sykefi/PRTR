import os


def read_env_variables_from_file(dir: str):
    """Reads environment variables to env from file .env.
    The expected content of the file is one name=value row per env variable.
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


def read_required_env_var(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise EnvironmentError(
            f'Environment variable {name} needs to be set.\n'
            f'Add file .env containing at least {name}=<some_value>'
        )
    return value
