import type { Feature, Geometry } from "geojson";

export type BrazilStateFeature = Feature<Geometry, { codarea: string }>;

export function orientRingsForD3(feature: BrazilStateFeature): BrazilStateFeature {
  const geometry = feature.geometry;
  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach((ring) => ring.reverse());
  }
  if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((polygon) => polygon.forEach((ring) => ring.reverse()));
  }
  return feature;
}
