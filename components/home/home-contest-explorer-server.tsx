import "server-only";
import { loadBrazilStates } from "@/components/contests/brazil-map-server";
import { HomeContestExplorer } from "@/components/home/home-contest-explorer";
import type { Contest, Product } from "@/types/content";

export async function HomeContestExplorerServer({ contests, products }: { contests: Contest[]; products: Product[] }) {
  const features = await loadBrazilStates();
  return <HomeContestExplorer contests={contests} products={products} features={features}/>;
}
