const parseBooleanFromEnv = (envVar): boolean => {
  return typeof envVar === "string" && envVar.toLowerCase() === "true";
};

export const yearOptions = JSON.parse(
  "[" + process.env.VUE_APP_DATA_YEAR_OPTIONS + "]"
) as number[];

export const latestYear: number = yearOptions[yearOptions.length - 1];

export const gsUri: string = process.env.VUE_APP_GEOSERVER_URI;

export const useAggregatedGnfrs: boolean = parseBooleanFromEnv(
  process.env.VUE_APP_USE_AGGREGATED_GNFRS
);

export const useProdPollutants: boolean = parseBooleanFromEnv(
  process.env.VUE_APP_USE_PROD_POLLUTANT_LIST
);

export const downloadFullDataEnabled: boolean = parseBooleanFromEnv(
  process.env.VUE_APP_DOWNLOAD_FULL_DATA_CSV_ENABLED
);
