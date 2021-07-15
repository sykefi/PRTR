"""
A script for reading E-PRTR data from MS Access DB.

E-PRTR data is available for download at https://industry.eea.europa.eu/download

Requires installation of driver MS for Access DB: "Microsoft Access Database Engine 2016 Redistributable" (or newer)
(https://www.microsoft.com/en-us/download/details.aspx?id=54920)

TODO:
    - add real queries
    - export data to CSV
"""

import pyodbc
from conf import conf


access_driver = 'Microsoft Access Driver (*.mdb, *.accdb)'


drivers = [i for i in pyodbc.drivers()]
if access_driver not in drivers:
    raise EnvironmentError(
        f'No driver for .accdb files found - expected to have driver "{access_driver}" available.\n'
        f'Available drivers: {drivers}'
    )


conn = pyodbc.connect(
    fr'Driver={{{access_driver}}};'
    fr'DBQ={conf.prtr_db_file_path};'
)
cursor = conn.cursor()


sql = (
    '''
    SELECT 
    [2_ProductionFacility].Facility_INSPIRE_ID 
    FROM 2_ProductionFacility;
    '''
)
cursor.execute(sql)

for idx, row in enumerate(cursor.fetchall()):
    if idx < 5:
        print(row)
