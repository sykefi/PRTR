import {
  Pollutant,
  MuniFeatureCollection,
  WfsMuniFeatureCollection,
  MuniFeature,
  GridFeatureCollection,
  PollutantValues,
  TotalEmissionStats
} from "@/types";
import * as cache from "./cache";
import { m2tokm2 } from "../constants";
import * as env from "../env";

const gridDataGnfrTable = env.useAggregatedGnfrs
  ? "p_grid_data_gnfr_prod"
  : "p_grid_data_gnfr_dev";

const muniDataGnfrTable = env.useAggregatedGnfrs
  ? "p_muni_data_gnfr_prod"
  : "p_muni_data_gnfr_dev";

const gridDataTotalsTable = "p_grid_data_totals";
const muniDataTotalsTable = "p_muni_data_totals";
const outputFormat = "&outputFormat=application/json";

const getWfsGridDataUri = (year: number, gnfrId: string, pollutantId: string): string => {
  return `${env.gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=hajapaastotkartalla:${gridDataGnfrTable}&propertyName=grid_id,${pollutantId}
    ${outputFormat}&viewparams=year:${year};gnfr:${gnfrId}`.replace(/ /g, "");
};

const getWfsTotalGridDataUri = (year: number, pollutantId: string): string => {
  return `${env.gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=hajapaastotkartalla:${gridDataTotalsTable}&propertyName=grid_id,${pollutantId}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

const getGridDataCacheKey = (
  year: number,
  gnfrId: string,
  pollutantId: string,
  unitCoefficient: number
): string => {
  return `pollutant_map_grid_data_${year}_${gnfrId}_${pollutantId}_${unitCoefficient}`;
};

export const fetchGridData = async (
  year: number,
  gnfrId: string,
  pollutantId: string,
  unitCoefficient = 1
): Promise<Map<number, number> | undefined> => {
  const uri =
    gnfrId === "COMBINED"
      ? getWfsTotalGridDataUri(year, pollutantId)
      : getWfsGridDataUri(year, gnfrId, pollutantId);

  const cacheKey = getGridDataCacheKey(year, gnfrId, pollutantId, unitCoefficient);
  const cached = cache.getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  const emissionMap: Map<number, number> = new Map();
  try {
    const response = await fetch(encodeURI(uri));
    const fc = (await response.json()) as GridFeatureCollection;
    fc.features
      .map((feat) => feat.properties)
      .forEach((props) => {
        const emission = props[pollutantId] * unitCoefficient;
        emissionMap.set(props.grid_id, emission);
      });
    cache.setToCache(cacheKey, emissionMap);
    return emissionMap;
  } catch (error) {
    console.error(error);
  }
};

const getMuniDataCacheKey = (
  year: number,
  gnfrId: string,
  pollutantId: string,
  unitCoefficient: number
): string => {
  return `pollutant_map_muni_data_${year}_${gnfrId}_${pollutantId}_${unitCoefficient}`;
};

const getWfsMuniDataGnfrUri = (year: number, gnfrId: string, pollutantId: string): string => {
  return `${env.gsUri}ows?service=WFS&version=1.0.0
  &request=GetFeature&typeName=hajapaastotkartalla:${muniDataGnfrTable}&propertyName=geom,kuntanro,nimi,namn,area,${pollutantId}
  ${outputFormat}&viewparams=year:${year};gnfr:${gnfrId}`.replace(/ /g, "");
};

const getWfsMuniDataTotalsUri = (year: number, pollutantId: string): string => {
  return `${env.gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=hajapaastotkartalla:${muniDataTotalsTable}&propertyName=geom,kuntanro,nimi,namn,area,${pollutantId}
    ${outputFormat}&viewparams=year:${year}`.replace(/ /g, "");
};

export const fetchMuniFeatures = async (
  year: number,
  gnfrId: string,
  pollutantId: string,
  unitCoefficient = 1
): Promise<MuniFeatureCollection | undefined> => {
  const uri =
    gnfrId === "COMBINED"
      ? getWfsMuniDataTotalsUri(year, pollutantId)
      : getWfsMuniDataGnfrUri(year, gnfrId, pollutantId);
  const cacheKey = getMuniDataCacheKey(year, gnfrId, pollutantId, unitCoefficient);
  const cached = cache.getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(encodeURI(uri));
    const rawFc = (await response.json()) as WfsMuniFeatureCollection;
    // calculate pollutant densities to feature properties
    const features: MuniFeature[] = rawFc.features.map((feat) => {
      const name = {
        fi: feat.properties.nimi,
        sv: feat.properties.namn,
        en: feat.properties.nimi
      };
      const properties = { id: feat.properties.kuntanro, name, area: feat.properties.area };
      const emission = feat.properties[pollutantId] * unitCoefficient;
      properties[pollutantId] = emission;
      properties[pollutantId + "-density"] = emission / (feat.properties.area * m2tokm2);
      const feature = { geometry: feat.geometry, type: feat.type, properties };
      return feature;
    });
    const fc = {
      type: "FeatureCollection",
      features: features
    } as MuniFeatureCollection;
    cache.setToCache(cacheKey, fc);
    return fc;
  } catch (error) {
    console.error(error);
  }
};

const calculateTotalEmissions = (grid: Map<number, number>, pollutantId: string): number => {
  let sum = 0;
  grid.forEach(value => {
    sum += value;
  });
  return sum
};

const getTotalEmissions = async (
  year: number,
  gnfrId: string,
  pollutantId: string
): Promise<number | undefined> => {
  const totalEmissionsId = `${year}_${gnfrId}_${pollutantId}_total`;

  if (cache.hasKey(totalEmissionsId)) {
    return cache.getFromCache(totalEmissionsId);
  }
  //const fc = await fetchMuniFeatures(year, gnfrId, pollutantId);
  const grid = await fetchGridData(year, gnfrId, pollutantId);
  if (grid) {
    const totalEmissions = calculateTotalEmissions(grid, pollutantId);
    cache.setToCache(totalEmissionsId, totalEmissions);
    return totalEmissions;
  }
};

export const getTotalEmissionStats = async (
  year: number,
  gnfrId: string,
  pollutant: Pollutant
): Promise<TotalEmissionStats | undefined> => {
  const gnfrEmissions = await getTotalEmissions(year, gnfrId, pollutant.id);
  const totalEmissions = await getTotalEmissions(year, "COMBINED", pollutant.id);
  if ((gnfrEmissions || gnfrEmissions === 0) && totalEmissions) {
    return { gnfrId, gnfrEmissions, totalEmissions, unit: pollutant.unit };
  }
  return undefined;
};
