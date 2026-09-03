import Link from "next/link";
import { statusLabels } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Contest } from "@/types/content";

export function ContestCard({ contest, heading = "h2" }: { contest: Contest; heading?: "h2" | "h3" }) {
  const Heading = heading;
  return <Link href={`/concursos/${contest.slug}`} className="contest-card">
    <div className="contest-card-top"><div><span className="product-category">{contest.acronym} • {contest.states.join(", ") || "Brasil"}</span><Heading>{contest.title}</Heading></div><span className="contest-badge">{statusLabels[contest.status]}</span></div>
    <p className="product-description">{contest.summary}</p>
    <div className="contest-facts"><div className="fact"><span>Vagas</span><strong>{contest.openings}</strong></div><div className="fact"><span>Salário</span><strong>{contest.salary}</strong></div><div className="fact"><span>Banca</span><strong>{contest.examBoard}</strong></div></div>
    <div className={contest.product ? "has-course" : "map-hint"}>{contest.product ? "Preparação CPPEM disponível →" : `Verificado em ${formatDate(contest.lastVerifiedAt)}`}</div>
  </Link>;
}
