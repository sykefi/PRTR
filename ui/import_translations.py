import csv
import json


translate_info = [
    {'lang': 'fi', 'trans_field_name': 'Selite_suomi'},
    {'lang': 'sv', 'trans_field_name': 'Selite_ruotsi'},
    {'lang': 'en', 'trans_field_name': 'Selite_eng'},
]

main_activity_codes_data = {}

with open('translation_source/facility_types.csv') as file: 
    reader = csv.DictReader(file, delimiter=';', quotechar='|')
    main_activity_codes_data = [row for row in reader]

def as_translation_dict(data: dict, key_field: str, trans_field: str):
    return {
        row[key_field].strip(): row[trans_field].strip()
        for row in data
    }

for t_info in translate_info:
    with open(f'public/locales/{t_info["lang"]}/mainActivityCodeDesc.json', 'w', encoding='utf8') as outfile:
        outfile.write(
            json.dumps(
                as_translation_dict(main_activity_codes_data, 'EU_EPRTR', t_info["trans_field_name"]),
                indent = 2,
                ensure_ascii=False
            )
        )
        outfile.write('\n')
