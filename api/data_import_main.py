"""
A script for reading E-PRTR data from MS Access DB.

E-PRTR data is available for download at
https://industry.eea.europa.eu/download

Requires installation of driver MS for Access DB: "Microsoft Access Database
Engine 2016 Redistributable" (or newer)
(https://www.microsoft.com/en-us/download/details.aspx?id=54920)

"""

from data_import.utils import (
    add_projected_x_y_columns, clean_names, ensure_no_unlinked_releases_or_transfers,
    handle_merge_duplicate_facilities, print_main_activity_codes_as_enum,
    print_unique_values_as_enum, clean_id, ensure_unique_ids,
    update_facility_ids_by_merge_map, clear_location_data_for_main_activity_7
)
from data_import.conf import conf
from data_import.log import log
import data_import.queries as queries
import os
import pandas as pd
import pyodbc


accdb_driver = 'Microsoft Access Driver (*.mdb, *.accdb)'


# ensure that the required driver is available for opening .accdb data
drivers = [i for i in pyodbc.drivers()]
if accdb_driver not in drivers:
    raise EnvironmentError(
        f'No driver for .accdb files found'
        f' - expected to have driver "{accdb_driver}" available.\n'
        f'Available drivers: {drivers}'
    )


if not os.path.exists(conf.prtr_db_file_path):
    raise EnvironmentError(
        f'No data file found in the specified path: {conf.prtr_db_file_path}'
    )


print(f'Attempting to read PRTR data from {conf.prtr_db_file_path}')
conn = pyodbc.connect(
    fr'Driver={{{accdb_driver}}};'
    fr'DBQ={conf.prtr_db_file_path};'
)


facilities = pd.read_sql_query(queries.sql_facilities, conn)
log(f'Read {len(facilities)} facilities')

# clean person names from data
facilities['parentCompanyName'] = [
    clean_names(comp_str) for comp_str in facilities['parentCompanyName']
]
facilities['nameOfFeature'] = [
    clean_names(name_str) for name_str in facilities['nameOfFeature']
]

facilities['facilityId'] = [
    clean_id(id_str) for id_str in facilities['Facility_INSPIRE_ID']
]
ensure_unique_ids(facilities)

add_projected_x_y_columns(facilities)

if conf.print_uniq_values_from_columns:
    print_main_activity_codes_as_enum(facilities)


releases = pd.read_sql_query(queries.sql_releases, conn)
log(f'Read {len(releases)} releases')

releases['facilityId'] = [
    clean_id(id_str) for id_str in releases['Facility_INSPIRE_ID']
]


ensure_no_unlinked_releases_or_transfers(facilities, releases)


if conf.print_uniq_values_from_columns:
    print_unique_values_as_enum(releases, 'pollutantCode')
    print_unique_values_as_enum(releases, 'pollutantName')
    print_unique_values_as_enum(releases, 'medium')
    print_unique_values_as_enum(releases, 'methodCode')


waste_transfers = pd.read_sql_query(queries.sql_waste_transfers, conn)
log(f'Read {len(waste_transfers)} waste transfers')

waste_transfers['facilityId'] = [
    clean_id(id_str) for id_str in waste_transfers['Facility_INSPIRE_ID']
]


ensure_no_unlinked_releases_or_transfers(
    facilities,
    waste_transfers,
    error_label='waste transfers'
)

if conf.print_uniq_values_from_columns:
    print_unique_values_as_enum(waste_transfers, 'wasteClassificationCode')
    print_unique_values_as_enum(waste_transfers, 'wasteTreatmentCode')
    print_unique_values_as_enum(waste_transfers, 'methodCode')


if not os.path.exists(conf.csv_out_dir):
    os.makedirs(conf.csv_out_dir)

facilities = clear_location_data_for_main_activity_7(facilities)

facilities.to_csv(
    fr'{conf.csv_out_dir}/facilities.csv',
    sep=';',
    index=False,
    encoding='utf-8'
)
log(f'Wrote facilities to file: {conf.csv_out_dir}/facilities.csv')

releases.to_csv(
    fr'{conf.csv_out_dir}/releases.csv',
    sep=';',
    index=False,
    encoding='utf-8'
)
log(f'Wrote releases to file: {conf.csv_out_dir}/releases.csv')

waste_transfers.to_csv(
    fr'{conf.csv_out_dir}/waste_transfers.csv',
    sep=';',
    index=False,
    encoding='utf-8'
)
log(f'Wrote waste_transfers to file: {conf.csv_out_dir}/waste_transfers.csv')
