
DROP TABLE IF EXISTS muni_data_gnfr_dev_backup;
SELECT * INTO muni_data_gnfr_dev_backup FROM muni_data_gnfr_dev;

DROP TABLE IF EXISTS muni_data_gnfr_prod_backup;
SELECT * INTO muni_data_gnfr_prod_backup FROM muni_data_gnfr_prod;

DROP TABLE IF EXISTS muni_data_totals_backup;
SELECT * INTO muni_data_totals_backup FROM muni_data_totals;
