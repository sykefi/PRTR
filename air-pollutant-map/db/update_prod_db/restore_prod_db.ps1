$pg_restore = "C:\'Program Files\pgAdmin 4\v5\runtime\pg_restore.exe'"

$dbHost = ''
$dbName = ''
$dbUser = ''

$dump_file = "'dev_dumps\dev.dump'"

# $array = @("muni_data_gnfr_dev") # for testing as this table is not used in prod
$array = @("muni_data_gnfr_dev", "muni_data_gnfr_prod", "muni_data_totals", "grid_data_gnfr_dev", "grid_data_gnfr_prod", "grid_data_totals")

for ($i=0; $i -lt $array.length; $i++) {
    $table_name = $array[$i]
    Write-Output "`nRestoring table: $table_name (give password to db user $dbUser)"
    # --clean drops & restores
    iex "& $pg_restore -h $dbHost -d $dbName -U $dbUser --no-owner --role=$dbUser --table=$table_name --clean --single-transaction --format=c $dump_file"
}

# optional step: update also meta tables by uncommenting the last commented line
$meta_tables= @("pollutant_meta", "gnfr_meta", "gnfr_pollutant_meta")

for ($i=0; $i -lt $meta_tables.length; $i++) {
    $table_name = $meta_tables[$i]
    # Write-Output "`nRestoring table: $table_name (give password to db user $dbUser)"
    # --clean drops & restores
    # iex "& $pg_restore -h $dbHost -d $dbName -U $dbUser --no-owner --role=$dbUser --table=$table_name --clean --single-transaction --format=c $dump_file"
}
