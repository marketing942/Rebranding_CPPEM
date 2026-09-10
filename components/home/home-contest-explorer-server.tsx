import "server-only";
import { loadBrazilStates } from "@/components/contests/brazil-map-server";
import { HomeContestExplorer } from "@/components/home/home-contest-explorer";
import type { Contest } from "@/types/content";

export async function HomeContestExplorerServer({ contests }: { contests: Contest[] }) {
  const features = await loadBrazilStates();
  return <HomeContestExplorer contests={contests} features={features}/>;
}
