export enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test"
}

export interface PollutantValues {
  s16?: number;
  s15?: number;
  s22?: number;
  s13?: number;
  s28?: number;
  s29?: number;
  s27?: number;
  s43?: number;
  s5?: number;
  s18?: number;
  s3?: number;
  s12?: number;
  s1?: number;
  s7?: number;
  s8?: number;
  s14?: number;
  s37?: number;
  s25?: number;
  s19?: number;
  s17?: number;
  s38?: number;
  s40?: number;
}

export enum MapDataType {
  MUNICIPALITY = "Municipality",
  GRID = "Grid"
}

interface ValueRange {
  min: number;
  max: number;
  color: string;
}

export interface PollutantLegend {
  classNames: number[];
  [key: number]: ValueRange;
  unit: string;
}

export interface Polygon {
  coordinates: number[][];
  type: "Polgyon";
}

interface MultiPolygon {
  coordinates: number[][][];
  type: "MultiPolygon";
}

export interface FeatureCollection {
  type: "FeatureCollection";
  crs: { properties: { name: string; type: string } };
}

interface GridFeatureProperties extends PollutantValues {
  grid_id: number;
}

export interface GridFeature {
  geometry: Polygon;
  properties: GridFeatureProperties;
}

export interface GridFeatureCollection extends FeatureCollection {
  features: GridFeature[];
}

export interface WfsMuniFeatureProperties extends PollutantValues {
  kuntanro: number;
  nimi: string;
  namn: string;
  area: number;
}

interface WfsMuniFeature {
  type: "Feature";
  geometry: MultiPolygon;
  properties: WfsMuniFeatureProperties;
}

export interface WfsMuniFeatureCollection extends FeatureCollection {
  features: WfsMuniFeature[];
}

export interface MuniFeatureProperties extends PollutantValues {
  id: number;
  name: LangStringMap;
  area: number;
}

export interface MuniFeature {
  type: "Feature";
  geometry: MultiPolygon;
  properties: MuniFeatureProperties;
}

export interface MuniFeatureCollection extends FeatureCollection {
  features: MuniFeature[];
}

export interface LangStringMap {
  fi: string;
  sv: string;
  en: string;
}

export interface DbGnfr {
  nimi: string;
  namn: string;
  name: string;
  desc_fi: string;
  desc_sv: string;
  desc_en: string;
  use_dev: boolean;
  use_prod: boolean;
}
export interface Gnfr {
  id: string;
  name: LangStringMap;
  desc: LangStringMap;
  useDev: boolean;
  useProd: boolean;
}

export interface DbPollutantProps {
  id: string;
  parloc_ryhma_tunnus: number;
  parloc_ryhma_nimi: string;
  nimi: string;
  namn: string;
  name: string;
  yksikko: string;
  yksikko_legenda: string;
  kerroin_legenda: number;
  ryhma: string | null;
  use_dev: boolean;
  use_prod: boolean;
}

export interface DbPollutant {
  id: string;
  properties: DbPollutantProps;
}

export interface Pollutant {
  id: string;
  parlocGroupId: number;
  parlocGroupName: string;
  name: LangStringMap;
  unit: string;
  unitLegend: string;
  coeffLegend: number;
  group: string | null;
  useDev: boolean;
  useProd: boolean;
}

export interface DbGnfrPollutantMeta {
  year: number;
  gnfr: string;
  pollutant: string;
  rep_share: number;
  calc_share: number;
}

export interface GnfrPollutantMeta {
  year: number;
  gnfr: string;
  pollutant: string;
  repShare: number;
  calcShare: number;
}

export interface TotalEmissionStats {
  gnfrId: string;
  unit: string;
  gnfrEmissions: number;
  totalEmissions: number;
}

export interface Option {
  id: string;
  label: LangStringMap;
  showFirst: boolean;
  value: string | number | Gnfr | Pollutant | null;
}
