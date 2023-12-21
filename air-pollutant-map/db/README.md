### Update grid data (dev)

1. Open the PowerShell script `import_grid_data/import_grid_data.ps1`
2. Update the first variables in the script: $psql, $dbHost, $dbName, $dbUser & $csvFile
3. The variable `csvFile` should point to the new complete pollutant dataset as a CSV file 
3. Run the script 
4. In the end, there is an option to continue the script and restore previous versions of the updated tables

### Update municipality data (dev)

1. Open the PowerShell script `import_muni_data/import_muni_data.ps1`
2. Update the first variables in the script: $psql, $dbHost, $dbName, $dbUser & $csvFile
3. The variable `csvFile` should point to the new complete pollutant dataset (for municipalities) as a CSV file 
3. Run the script 
4. In the end, there is an option to continue the script and restore previous versions of the updated tables

### Update municipality geometries (dev, if changed)

See external documentation.


### Update prod db

See external documentation and directory update_prod_db/. Updating prod tables is done with pg_dump and pg_restore. 
