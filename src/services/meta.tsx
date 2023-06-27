import {
  DbGnfr,
  Gnfr,
  DbPollutant,
  DbPollutantProps,
  Pollutant,
  DbGnfrPollutantMeta,
  GnfrPollutantMeta
} from "@/types";
import * as env from "./../env";

const gnfrMetaTable = "p_gnfr_meta";
const pollutantMetaTable = "p_pollutant_meta";
const pollutantGnfrMetaTable = "p_gnfr_pollutant_meta";

const getGnfrObject = (featureId: string, props: DbGnfr): Gnfr => {
  // parse original id from the one created by GeoServer
  const id = featureId.split(".", 2)[1];
  const name = { fi: props.nimi, sv: props.namn, en: props.name };
  const desc = { fi: props.desc_fi, sv: props.desc_sv, en: props.desc_en };
  return { id, name, desc, useDev: props.use_dev, useProd: props.use_prod };
};

export const fetchGnfrMeta = async (): Promise<Gnfr[] | undefined> => {
  const uri = `${env.gsUri}ows?service=WFS&version=1.0.0&request=GetFeature
  &typeName=hajapaastotkartalla:${gnfrMetaTable}&outputFormat=application/json`.replace(/ /g, "");
  try {
    const response = await fetch(encodeURI(uri));
    const fc = await response.json();
    return fc.features
      .map((feat) => getGnfrObject(feat.id as string, feat.properties as DbGnfr))
      .filter((gnfr: Gnfr) => {
        if (env.useAggregatedGnfrs) {
          return gnfr.useProd;
        }
        return gnfr.useDev;
      });
  } catch (error) {
    console.error(error);
  }
};

const getPollutantObject = (featureId: string, props: DbPollutantProps): Pollutant => {
  // parse original id from the one created by GeoServer
  const id = featureId.split(".", 2)[1];
  return {
    id,
    parlocGroupId: props.parloc_ryhma_tunnus,
    parlocGroupName: props.parloc_ryhma_nimi,
    name: { fi: props.nimi, sv: props.namn, en: props.name },
    unit: props.yksikko,
    unitLegend: props.yksikko_legenda,
    coeffLegend: props.kerroin_legenda,
    group: props.ryhma,
    useDev: props.use_dev,
    useProd: props.use_prod
  };
};

export const fetchPollutantMeta = async (): Promise<Pollutant[] | undefined> => {
  const uri = `${env.gsUri}ows?service=WFS&version=1.0.0&request=GetFeature
  &typeName=hajapaastotkartalla:${pollutantMetaTable}
  &outputFormat=application/json`.replace(/ /g, "");
  try {
    const response = await fetch(encodeURI(uri));
    const fc = await response.json();
    return fc.features
      .map((feat: DbPollutant) => getPollutantObject(feat.id as string, feat.properties))
      .filter((pollutant: Pollutant) => {
        if (env.useProdPollutants) {
          return pollutant.useProd;
        }
        return pollutant.useDev;
      })
      .sort((a: Pollutant, b: Pollutant) => a.parlocGroupId - b.parlocGroupId);
  } catch (error) {
    console.error(error);
  }
};

const getGnfrPollutantMetaObject = (props: DbGnfrPollutantMeta): GnfrPollutantMeta => {
  return {
    year: props.year,
    gnfr: props.gnfr,
    pollutant: "s" + props.pollutant,
    calcShare: props.calc_share,
    repShare: props.rep_share
  };
};

export const fetchGnfrPollutantMetas = async (): Promise<GnfrPollutantMeta[] | undefined> => {
  const uri = `${env.gsUri}ows?service=WFS&version=1.0.0&request=GetFeature
  &typeName=hajapaastotkartalla:${pollutantGnfrMetaTable}
  &outputFormat=application/json`.replace(/ /g, "");
  try {
    const response = await fetch(encodeURI(uri));
    const fc = await response.json();
    return fc.features.map((feat) => getGnfrPollutantMetaObject(feat.properties));
  } catch (error) {
    console.error(error);
  }
};
