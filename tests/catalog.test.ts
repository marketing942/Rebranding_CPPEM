import { describe,expect,it } from "vitest";
import { whatsappHref } from "@/lib/constants";
import { fallbackContests } from "@/lib/mock-data";
import { filterContests,normalizeSearch,sortContests } from "@/lib/utils";

describe("catálogo de concursos",()=>{
  it("remove acentos e normaliza busca",()=>expect(normalizeSearch(" Polícia Civil ")).toBe("policia civil"));
  it("busca por sigla, órgão e cargo",()=>{ expect(filterContests(fallbackContests,{q:"escrivao"}).map((item)=>item.acronym)).toContain("PCPE"); expect(filterContests(fallbackContests,{q:"PMPE"})).toHaveLength(1); });
  it("combina estado, status e carreira",()=>{ const result=filterContests(fallbackContests,{state:"PE",status:"autorizado",career:"Polícia Civil"}); expect(result).toHaveLength(1); expect(result[0].acronym).toBe("PCPE"); });
  it("ordena concursos publicados e em andamento antes dos previstos",()=>{ const sorted=sortContests(fallbackContests); expect(sorted.findIndex((item)=>item.status==="autorizado")).toBeLessThan(sorted.findIndex((item)=>item.status==="previsto")); });
  it("cria mensagem contextualizada de WhatsApp",()=>expect(decodeURIComponent(whatsappHref("Concurso PMPE"))).toContain("Concurso PMPE"));
});
