
# adjust psql path if needed
$psql = "C:\'Program Files\pgAdmin 4\v4\runtime\psql.exe'"

# these need to be set
$dbHost = ''
$dbName = ''
$dbUser = ''

# $csvFile = 'csv_data/kuntadata5.csv'
$csvFile = 'csv_data/PaastotKunnittain1990-2019.csv'

Read-Host -Prompt "`nConnecting to db $dbName at $dbHost as $dbUser. Updating muni data from $csvFile. Press any key to continue"


Write-Output "`n1/4 Backups all muni data tables used by APIs"
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/backup_muni_data_tables.sql"


Write-Output "`n2/4 Creates an empty table muni_data_import_temp"
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/create_table_muni_data_import.sql"


Write-Output "`n3/4 Imports new muni data to muni_data_import_temp from csv."
$copyCsvSql = @'
"\copy public.muni_data_import_temp (vuosi,kuntanro,nimi,gnfr,s16,s15,s22,s13,s28,s29,s27,s43,s5,s18,s3,s12,s1,s7,s8,s14,s37,s25,s19,s17,s38,s40) FROM '$csvFile' with (format csv, header true, delimiter ';', encoding 'utf-8');"
'@
iex "& $psql -h $dbHost -d $dbName -U $dbUser -c $copyCsvSql"
Read-Host -Prompt "`nPress CTRL+C if the import was not successful or any key to continue"

Write-Output "`n4/4 Updates new muni data to tables for APIs (from muni_data_import_temp)."
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/create_tables_muni_data_apis.sql"


Write-Output "`nAll muni data tables updated."


# Option to revert the import by restoring muni data from backup tables
Read-Host -Prompt "`nExit here (CTRL+C) if you do not want to restore muni data from backup tables (or press any key)"
Read-Host -Prompt "`nIf you proceed, muni data will be restored from backup tables. Exit with CTRL+C or press any key to contnue"
Write-Output "`nRestoring muni data from backup tables..."
iex "& $psql -h $dbHost -d $dbName -U $dbUser -f sql/restore_muni_data_tables.sql"


Write-Output "`nAll done."

