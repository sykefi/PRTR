"""
A script for reading E-PRTR data from MS Access DB.

E-PRTR data is available for download at https://industry.eea.europa.eu/download

Requires installation of driver MS for Access DB: "Microsoft Access Database Engine 2016 Redistributable" (or newer)
(https://www.microsoft.com/en-us/download/details.aspx?id=54920)

"""

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


sql_facilities = (
    f'''
    SELECT
    [2_ProductionFacility].Facility_INSPIRE_ID,
    [2_ProductionFacility].parentCompanyName,
    [2_ProductionFacility].nameOfFeature,
    [2_ProductionFacility].mainActivityCode,
    [2_ProductionFacility].mainActivityName,
    [2_ProductionFacility].pointGeometryLon,
    [2_ProductionFacility].pointGeometryLat,
    [2_ProductionFacility].streetName,
    [2_ProductionFacility].buildingNumber,
    [2_ProductionFacility].postalCode,
    [2_ProductionFacility].city,
    [2_ProductionFacility].countryCode,
    [2d_CompetentAuthorityEPRTR].telephoneNo
    FROM
    (
        2_ProductionFacility
        LEFT JOIN 2d_CompetentAuthorityEPRTR ON
        [2_ProductionFacility].Facility_INSPIRE_ID = [2d_CompetentAuthorityEPRTR].Facility_INSPIRE_ID
    )
    WHERE [2_ProductionFacility].countryCode='{conf.country_code}';
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
        [2f_PollutantRelease].Facility_INSPIRE_ID = [2_ProductionFacility].Facility_INSPIRE_ID
    )
    WHERE [2_ProductionFacility].countryCode='{conf.country_code}';
    '''
)


conn = pyodbc.connect(
    fr'Driver={{{accdb_driver}}};'
    fr'DBQ={conf.prtr_db_file_path};'
)


facilities = pd.read_sql_query(sql_facilities, conn)
print(f'Read {len(facilities)} facilities from {conf.prtr_db_file_path}')

releases = pd.read_sql_query(sql_releases, conn)
print(f'Read {len(releases)} releases from {conf.prtr_db_file_path}')


if not os.path.exists(conf.csv_out_dir):
    os.makedirs(conf.csv_out_dir)

facilities.to_csv(fr'{conf.csv_out_dir}/facilities.csv', sep=';', index=False)
releases.to_csv(fr'{conf.csv_out_dir}/releases.csv', sep=';', index=False)
