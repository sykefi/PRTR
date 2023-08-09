DROP TABLE IF EXISTS public.gnfr_pollutant_meta;

CREATE TABLE public.gnfr_pollutant_meta
(
    year integer,
    gnfr varchar(35),
    pollutant varchar(6),
    rep_share double precision,
    calc_share double precision
);
