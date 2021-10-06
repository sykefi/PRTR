import os
from typing import Union
from data_import.conf import conf
from datetime import datetime


def log(text: Union[str, int, float, dict]):
    with open(conf.log_file, 'a', encoding='utf8') as the_file:
        log_text = str(text)
        print(log_text)
        the_file.write(log_text + '\n')


if os.path.exists(conf.log_file):
    os.remove(conf.log_file)
    log(f'PRTR-data import: {datetime.now().strftime("%y/%m/%d %H:%M:%S")}')
