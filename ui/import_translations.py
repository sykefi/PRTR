import csv
import json
from typing import List

"""
This script creates translation/JSON files for i18-react from CSV files.

If errors occur when running the script, check at least the following:
    - Column names need to match the ones in translations_todo dictionaries
    - The encoding settings below need to match the CSV data
"""


general_ui_encoding = 'utf-8-sig'
facility_types_encoding = 'utf-8-sig'
pollutant_codes_encoding = 'utf-8-sig'


# GENERAL TRANSLATIONS

translations_todo = [
    {'lang': 'fi', 'trans_field_name': 'FI'},
    {'lang': 'sv', 'trans_field_name': 'SV'},
    {'lang': 'en', 'trans_field_name': 'EN'},
]

general_translations_data = {}
with open('translation_source/general_ui.csv', encoding=general_ui_encoding) as file: 
    reader = csv.DictReader(file, delimiter=';', quotechar='|')
    general_translations_data = [row for row in reader]

def append_to_nested_dict(dic: dict, key_path: List[str], value: str):
    for key in key_path[:-1]:
        dic = dic.setdefault(key, {})
    dic[key_path[-1]] = value

def as_translation_dict(data: dict, key_field: str, trans_field: str):
    t_dict = {}
    for row in data:
        key_str = row[key_field]
        value_str = row[trans_field].strip() if row[trans_field] else ''
        if not key_str or not value_str:
            continue
        key_path_list = key_str.split('.')
        append_to_nested_dict(t_dict, key_path_list, value_str)
    return t_dict

for t_info in translations_todo:
    with open(f'public/locales/{t_info["lang"]}/translation.json', 'w', encoding='utf8') as outfile:
        outfile.write(
            json.dumps(
                as_translation_dict(general_translations_data, 'translationKey', t_info['trans_field_name']),
                indent = 2,
                ensure_ascii=False
            )
        )
        outfile.write('\n')


# FACILITY TYPES

translations_todo = [
    {'lang': 'fi', 'trans_field_name': 'Selite_suomi'},
    {'lang': 'sv', 'trans_field_name': 'Selite_ruotsi'},
    {'lang': 'en', 'trans_field_name': 'Selite_eng'},
]

main_activity_codes_data = {}
with open('translation_source/facility_types.csv', encoding=facility_types_encoding) as file: 
    reader = csv.DictReader(file, delimiter=';', quotechar='|')
    main_activity_codes_data = [row for row in reader]

def as_translation_dict(data: dict, key_field: str, trans_field: str):
    return {
        row[key_field].strip(): row[trans_field].strip() if row[trans_field] else ''
        for row in data
    }

for t_info in translations_todo:
    with open(f'public/locales/{t_info["lang"]}/mainActivityCodeDesc.json', 'w', encoding='utf8') as outfile:
        outfile.write(
            json.dumps(
                as_translation_dict(main_activity_codes_data, 'EU_EPRTR', t_info["trans_field_name"]),
                indent = 2,
                ensure_ascii=False
            )
        )
        outfile.write('\n')


# POLLUTANT CODES

translations_todo = [
    {'lang': 'fi', 'trans_field_name': 'FI', 'transFileName': 'pollutantName.json'},
    {'lang': 'sv', 'trans_field_name': 'SE', 'transFileName': 'pollutantName.json'},
    {'lang': 'en', 'trans_field_name': 'EN', 'transFileName': 'pollutantName.json'},
    {'lang': 'fi', 'trans_field_name': 'Lyhenne - förkortning - abbreviation', 'transFileName': 'pollutantAbbreviation.json'},
    {'lang': 'fi', 'trans_field_name': 'CAS-numero/nummer/number', 'transFileName': 'pollutantCasNumber.json'}
]

pollutant_code_data = {}
with open('translation_source/pollutant_codes.csv', encoding=pollutant_codes_encoding) as file: 
    reader = csv.DictReader(file, delimiter=';', quotechar='|')
    pollutant_code_data = [row for row in reader]

def as_translation_dict(data: dict, key_field: str, trans_field: str):
    return {
        row[key_field].strip():
        row[trans_field].strip() if row[trans_field] else '' 
        for row in data
    }

for t_info in translations_todo:
    with open(f'public/locales/{t_info["lang"]}/{t_info["transFileName"]}', 'w', encoding='utf8') as outfile:
        outfile.write(
            json.dumps(
                as_translation_dict(pollutant_code_data, 'pollutantCode', t_info["trans_field_name"]),
                indent = 2,
                ensure_ascii=False
            )
        )
        outfile.write('\n')
