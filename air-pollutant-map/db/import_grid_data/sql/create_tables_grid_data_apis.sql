

-- grid_data_gnfr_dev

DROP TABLE IF EXISTS grid_data_gnfr_dev;

CREATE TABLE grid_data_gnfr_dev AS (
    SELECT vuosi, grid_id, gnfr, s1,s43,s3,s5,s7,s8,s38,s12,s13,s14,s15,s16,s17,s18,s40,s19,s29,s28,s37,s22,s27,s25 FROM grid_data_import_temp
);

CREATE INDEX gnfr_dev_year_gnfr_idx ON grid_data_gnfr_dev (vuosi, gnfr);
GRANT SELECT ON grid_data_gnfr_dev TO hajapaastotkartalla;



-- grid_data_gnfr_prod

DROP TABLE IF EXISTS public.gnfr_dev_prod_map;

CREATE TABLE public.gnfr_dev_prod_map (
  gnfr_dev VARCHAR(40) NOT NULL,
  gnfr_prod VARCHAR(40) NOT NULL
);

INSERT INTO
  public.gnfr_dev_prod_map (gnfr_dev, gnfr_prod)
VALUES
  ('A_PublicPower',	'GROUP_PowerIndustry'),
  ('B_Industry',	'GROUP_PowerIndustry'),
  ('D_Fugitive',	'GROUP_PowerIndustry'),
  ('C_OtherStationaryComb',	'GROUP_OtherComb'),
  ('I_Offroad',	'GROUP_Transport'),
  ('H_Aviation',	'GROUP_Transport'),
  ('F_RoadTransport',	'GROUP_Transport'),
  ('G_Shipping',	'GROUP_Transport'),
  ('E_Solvents',	'GROUP_Products'),
  ('M_Other',	'GROUP_Products'),
  ('J_Waste',	'GROUP_Products'),
  ('K_AgriLivestock',	'GROUP_Agriculture'),
  ('L_AgriOther',	'GROUP_Agriculture');

-- group grid data (master) by prod gnfr names
DROP TABLE IF EXISTS public.grid_data_gnfr_prod;

CREATE TABLE public.grid_data_gnfr_prod AS (
  SELECT vuosi, grid_id, gnfr_prod as gnfr, sum(s1) as s1,sum(s43) as s43,sum(s3) as s3,sum(s5) as s5,sum(s7) as s7,sum(s8) as s8,sum(s38) as s38,sum(s12) as s12,sum(s13) as s13,sum(s14) as s14,sum(s15) as s15,sum(s16) as s16,sum(s17) as s17,sum(s18) as s18,sum(s40) as s40,sum(s19) as s19,sum(s29) as s29,sum(s28) as s28,sum(s37) as s37,sum(s22) as s22,sum(s27) as s27,sum(s25) as s25
  FROM grid_data_import_temp AS GD
  INNER JOIN public.gnfr_dev_prod_map AS GNFR_MAP ON GNFR_MAP.gnfr_dev = GD.gnfr
  GROUP BY vuosi, grid_id, gnfr_prod
);

CREATE INDEX gnfr_prod_year_gnfr_idx ON grid_data_gnfr_prod (vuosi, gnfr);
GRANT SELECT ON grid_data_gnfr_prod TO hajapaastotkartalla;

-- drop temporary tables
DROP TABLE gnfr_dev_prod_map;



-- grid_data_totals

DROP TABLE IF EXISTS grid_data_totals;

CREATE TABLE grid_data_totals AS (
  SELECT vuosi, grid_id, sum(s1) as s1,sum(s43) as s43,sum(s3) as s3,sum(s5) as s5,sum(s7) as s7,sum(s8) as s8,sum(s38) as s38,sum(s12) as s12,sum(s13) as s13,sum(s14) as s14,sum(s15) as s15,sum(s16) as s16,sum(s17) as s17,sum(s18) as s18,sum(s40) as s40,sum(s19) as s19,sum(s29) as s29,sum(s28) as s28,sum(s37) as s37,sum(s22) as s22,sum(s27) as s27,sum(s25) as s25
  FROM grid_data_import_temp
  GROUP BY vuosi, grid_id
);

CREATE INDEX grid_data_totals_year_idx ON grid_data_totals (vuosi);
GRANT SELECT ON grid_data_totals TO hajapaastotkartalla;
