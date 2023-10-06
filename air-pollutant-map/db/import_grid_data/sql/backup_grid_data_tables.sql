
DROP TABLE IF EXISTS grid_data_gnfr_dev_backup;
SELECT * INTO grid_data_gnfr_dev_backup FROM grid_data_gnfr_dev;

DROP TABLE IF EXISTS grid_data_gnfr_prod_backup;
SELECT * INTO grid_data_gnfr_prod_backup FROM grid_data_gnfr_prod;

DROP TABLE IF EXISTS grid_data_totals_backup;
SELECT * INTO grid_data_totals_backup FROM grid_data_totals;
