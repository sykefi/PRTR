"""
A script for reading E-PRTR data from MS Access DB.

E-PRTR data is available for download at
https://industry.eea.europa.eu/download

Requires installation of driver MS for Access DB: "Microsoft Access Database
Engine 2016 Redistributable" (or newer)
(https://www.microsoft.com/en-us/download/details.aspx?id=54920)

"""

from data_import.utils import (
    add_projected_x_y_columns, ensure_no_unlinked_releases,
    handle_merge_duplicate_facilities, print_main_activity_codes_as_enum,
    print_unique_values_as_enum, clean_id, ensure_unique_ids
)
from data_import.conf import conf
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
        f'No data file found in the specified path: {conf.prtr_db_file_path}',
    )


sql_facilities = (
    f'''
    SELECT DISTINCT
    [2_ProductionFacility].Facility_INSPIRE_ID,
    [2_ProductionFacility].parentCompanyName,
    [2_ProductionFacility].nameOfFeature,
    [2_ProductionFacility].mainActivityCode,
    [2_ProductionFacility].mainActivityName,
    [2_ProductionFacility].pointGeometryLon,
    [2_ProductionFacility].pointGeometryLat,
    [2_ProductionFacility].streetName,
    [2_ProductionFacility].buildingNumber,
    [2_ProductionFacility].city,
    [2_ProductionFacility].postalCode,
    [2_ProductionFacility].countryCode,
    Max([2a_ProductionFacilityDetails].reportingYear) AS reportingYear,
    FIRST([2a_ProductionFacilityDetails].status) as status,
    FIRST([2d_CompetentAuthorityEPRTR].CompetentAuthorityEPRTRId)
        as CompetentAuthorityEPRTRId,
    FIRST([2d_CompetentAuthorityEPRTR].telephoneNo) as telephoneNo
    FROM (
        2_ProductionFacility
        LEFT JOIN 2a_ProductionFacilityDetails ON
            [2_ProductionFacility].[Facility_INSPIRE_ID] =
            [2a_ProductionFacilityDetails].[Facility_INSPIRE_ID]
        )
        LEFT JOIN 2d_CompetentAuthorityEPRTR ON
            [2_ProductionFacility].[Facility_INSPIRE_ID] =
            [2d_CompetentAuthorityEPRTR].[Facility_INSPIRE_ID]
    GROUP BY [2_ProductionFacility].Facility_INSPIRE_ID,
    [2_ProductionFacility].parentCompanyName,
    [2_ProductionFacility].nameOfFeature,
    [2_ProductionFacility].mainActivityCode,
    [2_ProductionFacility].mainActivityName,
    [2_ProductionFacility].pointGeometryLat,
    [2_ProductionFacility].pointGeometryLon,
    [2_ProductionFacility].streetName,
    [2_ProductionFacility].buildingNumber,
    [2_ProductionFacility].city,
    [2_ProductionFacility].postalCode,
    [2_ProductionFacility].countryCode,
    [2_ProductionFacility].facilityType
    HAVING (
        (
            [2_ProductionFacility].countryCode='{conf.country_code}' AND
            [2_ProductionFacility].facilityType='EPRTR'
        )
    );
    '''
)

sql_releases = (
    f'''
    SELECT
    [2f_PollutantRelease].Facility_INSPIRE_ID,
    [2f_PollutantRelease].reportingYear,
    [2f_PollutantRelease].pollutantCode,
    [2f_PollutantRelease].pollutantName,
    [2f_PollutantRelease].medium,
    [2f_PollutantRelease].totalPollutantQuantityKg,
    [2f_PollutantRelease].AccidentalPollutantQuantityKG,
    [2f_PollutantRelease].methodCode,
    [2f_PollutantRelease].methodName
    FROM
    (
        2f_PollutantRelease
        INNER JOIN 2_ProductionFacility ON
        [2f_PollutantRelease].Facility_INSPIRE_ID =
        [2_ProductionFacility].Facility_INSPIRE_ID
    )
    WHERE
    [2_ProductionFacility].countryCode='{conf.country_code}' AND
    [2_ProductionFacility].facilityType='EPRTR';
    '''
)


print(f'Attempting to read PRTR data from {conf.prtr_db_file_path}')
conn = pyodbc.connect(
    fr'Driver={{{accdb_driver}}};'
    fr'DBQ={conf.prtr_db_file_path};'
)


facilities = pd.read_sql_query(sql_facilities, conn)
facilities['facilityId'] = [
    clean_id(id_str) for id_str in facilities['Facility_INSPIRE_ID']
]
add_projected_x_y_columns(facilities)
print(f'Read {len(facilities)} facilities from {conf.prtr_db_file_path}')

if conf.print_uniq_values_from_columns:
    print_main_activity_codes_as_enum(facilities)


releases = pd.read_sql_query(sql_releases, conn)
releases['facilityId'] = [
    clean_id(id_str) for id_str in releases['Facility_INSPIRE_ID']
]
print(f'Read {len(releases)} releases from {conf.prtr_db_file_path}')


# merge duplicate facilities by name
facilities = handle_merge_duplicate_facilities(facilities, releases)
# ensure unique facilityIds and that all realease are linked to some facility
# (by facilityId)
ensure_unique_ids(facilities)
ensure_no_unlinked_releases(facilities, releases)


if conf.print_uniq_values_from_columns:
    print_unique_values_as_enum(releases, 'pollutantCode')
    print_unique_values_as_enum(releases, 'pollutantName')
    print_unique_values_as_enum(releases, 'medium')
    print_unique_values_as_enum(releases, 'methodCode')


if not os.path.exists(conf.csv_out_dir):
    os.makedirs(conf.csv_out_dir)

facilities.to_csv(
    fr'{conf.csv_out_dir}/facilities.csv',
    sep=';',
    index=False,
    encoding='utf-8'
)
releases.to_csv(
    fr'{conf.csv_out_dir}/releases.csv',
    sep=';',
    index=False,
    encoding='utf-8'
)
