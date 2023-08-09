# this is just a sample script for restoring one table to (dev) db

$pg_restore = "C:\'Program Files\pgAdmin 4\v4\runtime\pg_restore.exe'"

$dump_file = "'dev_dumps\dev.dump'"
$table_name = "hall100kunta2021"

$dbHost = ''
$dbName = ''
$dbUser = ''

# restore the specified table
# --clean drops & restores
iex "& $pg_restore -h $dbHost -d $dbName -U $dbUser --no-owner --role=$dbUser --table=$table_name --clean --single-transaction --format=c $dump_file"
