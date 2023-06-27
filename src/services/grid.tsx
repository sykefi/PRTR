import * as cache from "./cache";
import * as env from "./../env";
import { FeatureCollection, Polygon } from "@/types";

const gridGeomTable = "p_grid_geom";
const outputFormat = "&outputFormat=application/json";

interface GridFeature {
  id: string;
  geometry: Polygon;
  geometry_name: "geom";
  properties: { id: number };
}

interface GridFeatureCollection extends FeatureCollection {
  features: GridFeature[];
}

const getWfsGridUri = (): string => {
  return `${env.gsUri}ows?service=WFS&version=1.0.0
    &request=GetFeature&typeName=hajapaastotkartalla:${gridGeomTable}
    &propertyName=id,geom${outputFormat}`.replace(/ /g, "");
};

export const fetchGridFeatures = async (): Promise<GridFeatureCollection | undefined> => {
  const cached = cache.getFromCache("grid_geom") as GridFeatureCollection;
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(encodeURI(getWfsGridUri()));
    const fc = (await response.json()) as GridFeatureCollection;
    cache.setToCache("grid_geom", fc);
    return fc;
  } catch (error) {
    console.error(error);
  }
};
