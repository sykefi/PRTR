
DROP TABLE IF EXISTS grid_data_totals;
SELECT * INTO grid_data_totals FROM grid_data_totals_backup;
CREATE INDEX grid_data_totals_year_idx ON grid_data_totals (vuosi);
GRANT SELECT ON grid_data_totals TO hajapaastotkartalla;

DROP TABLE IF EXISTS grid_data_gnfr_dev;
SELECT * INTO grid_data_gnfr_dev FROM grid_data_gnfr_dev_backup;
CREATE INDEX gnfr_dev_year_gnfr_idx ON grid_data_gnfr_dev (vuosi, gnfr);
GRANT SELECT ON grid_data_gnfr_dev TO hajapaastotkartalla;

DROP TABLE IF EXISTS grid_data_gnfr_prod;
SELECT * INTO grid_data_gnfr_prod FROM grid_data_gnfr_prod_backup;
CREATE INDEX gnfr_prod_year_gnfr_idx ON grid_data_gnfr_prod (vuosi, gnfr);
GRANT SELECT ON grid_data_gnfr_prod TO hajapaastotkartalla;
