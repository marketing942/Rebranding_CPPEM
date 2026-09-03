import { readFileSync } from "node:fs";
import path from "node:path";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import { describe, expect, it } from "vitest";
import { orientRingsForD3, type BrazilStateFeature } from "@/lib/map-geometry";

describe("geometria do mapa do Brasil", () => {
  it("enquadra o Brasil em vez do complemento esférico dos estados", () => {
    const file = path.join(process.cwd(), "public", "data", "brazil-states.geojson");
    const collection = JSON.parse(readFileSync(file, "utf8")) as FeatureCollection<Geometry, { codarea: string }>;
    const features = collection.features.map(orientRingsForD3) as BrazilStateFeature[];
    const normalized: FeatureCollection = { type: "FeatureCollection", features };
    const projection = geoMercator().fitExtent([[35, 25], [565, 540]], normalized);
    const [[left, top], [right, bottom]] = geoPath(projection).bounds(normalized);

    expect(features).toHaveLength(27);
    expect(projection.scale()).toBeGreaterThan(500);
    expect(right - left).toBeGreaterThan(450);
    expect(bottom - top).toBeGreaterThan(480);
  });
});
