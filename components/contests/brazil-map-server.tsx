import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { FeatureCollection, Geometry } from "geojson";
import { BrazilMap, type StateFeature } from "@/components/contests/brazil-map";
import { orientRingsForD3 } from "@/lib/map-geometry";
import type { Contest } from "@/types/content";

export async function loadBrazilStates(): Promise<StateFeature[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "brazil-states.geojson");
    const raw = await readFile(filePath, "utf8");
    const collection = JSON.parse(raw) as FeatureCollection<Geometry, { codarea: string }>;
    // O GeoJSON segue a orientação RFC 7946. O d3-geo usa a convenção
    // esférica inversa; sem esta normalização cada estado vira o complemento
    // do polígono e a projeção enquadra o planeta inteiro.
    return collection.features.map(orientRingsForD3);
  } catch (error) {
    console.error("[mapa] Falha ao carregar a geometria do Brasil:", error instanceof Error ? error.message : "erro desconhecido");
    return [];
  }
}

export async function BrazilMapServer({ contests, compact = false }: { contests: Contest[]; compact?: boolean }) {
  const features = await loadBrazilStates();
  return <BrazilMap contests={contests} features={features} compact={compact}/>;
}
