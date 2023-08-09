import { utfBom } from "@/constants";
import { Lang } from "@/store";
import { Gnfr, LangStringMap, Pollutant } from "@/types";
import * as env from "../env";

interface PollutantValues {
  s16: number;
  s15: number;
  s22: number;
  s13: number;
  s28: number;
  s29: number;
  s27: number;
  s43: number;
  s5: number;
  s18: number;
  s3: number;
  s12: number;
  s1: number;
  s7: number;
  s8: number;
  s14: number;
  s37: number;
  s25: number;
  s19: number;
  s17: number;
  s38: number;
  s40: number;
}

interface MuniDataProperties extends PollutantValues {
  kuntanro: number;
  nimi: string;
  namn: string;
  vuosi: number;
  gnfr: string;
  area: number;
}

interface LocalMuniDataProperties extends MuniDataProperties {
  localGnfrName: string;
}

interface MuniDataFeature {
  properties: MuniDataProperties;
}

const downloadCsvContent = async (csvContent: string, filenamePrefix: string) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURI(utfBom + csvContent)
  );
  element.setAttribute("download", filenamePrefix + ".csv");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  await new Promise((resolve) =>
    setTimeout(() => resolve(document.body.removeChild(element)), 700)
  );
};

const outputFormat = "&outputFormat=application/json";
const muniDataGnfrTable = env.useAggregatedGnfrs
  ? "p_muni_data_gnfr_prod"
  : "p_muni_data_gnfr_dev";

const getWfsMuniDataGnfrUri = (pollutantIds: string[], muniId?: number): string => {
  const pollutantIdNames = pollutantIds.join(",");
  const muniFilter = muniId ? `&viewparams=kuntanro:${muniId}` : "";
  return `${env.gsUri}ows?service=WFS&version=1.0.0
  &request=GetFeature&typeName=hajapaastotkartalla:${muniDataGnfrTable}
  &propertyName=kuntanro,nimi,namn,vuosi,gnfr,area,${pollutantIdNames}${outputFormat}
  ${muniFilter}`.replace(/ /g, "");
};

const fetchMuniDataProps = async (
  pollutantIds: string[],
  muniId?: number
): Promise<MuniDataProperties[] | undefined> => {
  const uri = getWfsMuniDataGnfrUri(pollutantIds, muniId);
  try {
    const response = await fetch(encodeURI(uri));
    const rawFc = await response.json();
    return rawFc.features.map((feat: MuniDataFeature) => feat.properties);
  } catch (error) {
    console.error(error);
  }
};

const joinLocalGnfrNameToMuniDataProps = (
  muniDataProps: MuniDataProperties[],
  gnfrNameById: Map<string, LangStringMap>,
  lang: Lang
): LocalMuniDataProperties[] => {
  return muniDataProps.map((props) => {
    const localGnfrName = gnfrNameById.has(props.gnfr)
      ? gnfrNameById.get(props.gnfr)![lang]
      : props.gnfr;
    return { ...props, localGnfrName };
  });
};

const sortMuniData = (a: LocalMuniDataProperties, b: LocalMuniDataProperties) => {
  if (a.nimi !== b.nimi) {
    return a.nimi.localeCompare(b.nimi);
  }
  if (a.vuosi !== b.vuosi) {
    return a.vuosi - b.vuosi;
  }
  return a.localGnfrName.localeCompare(b.localGnfrName);
};

const getMuniDataCsvContent = async (
  headerRowPrefix: string,
  pollutantMetas: Pollutant[],
  gnfrNameById: Map<string, LangStringMap>,
  lang: Lang,
  muniId?: number
): Promise<string | undefined> => {
  const pollutantIds = pollutantMetas.map((props) => props.id);
  const muniData = await fetchMuniDataProps(pollutantIds, muniId);
  if (!muniData) return;

  const pollutantColNames = pollutantMetas.map(
    (p) => `${p.name.fi} - ${p.name.en} (${p.unit})`
  );
  const sortedMuniData = joinLocalGnfrNameToMuniDataProps(muniData, gnfrNameById, lang).sort(
    sortMuniData
  );

  const headerRow = headerRowPrefix + pollutantColNames.join(";");
  return sortedMuniData.reduce((csvContent, props, index) => {
    if (index == 0) {
      csvContent = headerRow + "\r\n";
    }
    const row = [props.kuntanro, props.nimi, props.namn, props.vuosi, props.localGnfrName]
      .concat(pollutantIds.map((id) => props[id]))
      .join(";");
    csvContent += row + "\r\n";
    return csvContent;
  }, "");
};

const mapGnfrNameById = (gnfrMetas: Gnfr[]) => {
  const gnfrNameById: Map<string, LangStringMap> = new Map();
  gnfrMetas.forEach((gnfr) => gnfrNameById.set(gnfr.id, gnfr.name));
  return gnfrNameById;
};

/**
 * Fetches and downloads all pollutant data of the given municipality as a CSV file.
 * Returns a boolean indicating the success (or failure) of the fetch & download.
 */
export const downloadMuniDataCsv = async (
  filenamePrefix: string,
  filenameSuffix: string,
  headerRowPrefix: string,
  lang: Lang,
  fetchGnfrMeta: () => Promise<Gnfr[] | undefined>,
  fetchPollutantMeta: () => Promise<Pollutant[] | undefined>,
  muniId?: number
): Promise<boolean> => {
  const gnfrMetas = await fetchGnfrMeta();
  const pollutantMetas = await fetchPollutantMeta();
  if (!pollutantMetas || !gnfrMetas) return false;

  const gnfrNameById = mapGnfrNameById(gnfrMetas);
  const csvContent = await getMuniDataCsvContent(
    headerRowPrefix,
    pollutantMetas,
    gnfrNameById,
    lang,
    muniId
  );

  if (csvContent) {
    const filename = filenamePrefix + (filenameSuffix ? "_" + filenameSuffix : "");
    try {
      await downloadCsvContent(csvContent, filename);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return false;
};
