
# adjust psql path if needed
$psql = "C:\'Program Files\pgAdmin 4\v6\runtime\psql.exe'"

# these need to be set
$dbHost = 'xpostgre-test-1'
$dbName = 'hajapaastotkartalla'
$dbUser = 'hajapaastotkartalla_upd'

# $csvFile = 'csv_data/griddata3.csv'
$csvFile = 'E:\Daniel\hajapaastot_data\PRTR_hajapaastot_test2.csv'

Read-Host -Prompt "`nConnecting to db $dbName at $dbHost as $dbUser. Updating grid data from $csvFile. Press any key to continue"

Write-Output "`n1/4 Backups all grid data tables used by APIs"
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/backup_grid_data_tables.sql"

Write-Output "`n2/4 Creates an empty table grid_data_import_temp"
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/create_table_grid_data_import.sql"

Write-Output "`n3/4 Imports new grid data to grid_data_import_temp from csv."
$copyCsvSql = @'
"\copy public.grid_data_import_temp (vuosi,grid_id,long,lat,gnfr,s1,s43,s3,s5,s7,s8,s38,s12,s13,s14,s15,s16,s17,s18,s40,s19,s29,s28,s37,s22,s27,s25) FROM '$csvFile' with (format csv, header true, delimiter ';', encoding 'utf-8');"
'@
iex "& $psql -h $dbHost -d $dbName -U $dbUser -c $copyCsvSql"
Read-Host -Prompt "`nPress CTRL+C if the import was not successful or any key to continue"

Write-Output "`n4/4 Updates new grid data to tables for APIs (from grid_data_import_temp)."
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/create_tables_grid_data_apis.sql"

Write-Output "`nAll grid data tables updated."


# Option to revert the import by restoring grid data from backup tables
Read-Host -Prompt "`nExit here (CTRL+C) if you do not want to restore grid data from backup tables (or press any key)"
Read-Host -Prompt "`nIf you proceed, grid data will be restored from backup tables. Exit with CTRL+C or press any key to contnue"
Write-Output "`nRestoring grid data from backup tables..."
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/restore_grid_data_tables.sql"


Write-Output "`nAll done."
