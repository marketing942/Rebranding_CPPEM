import { describe, expect, it } from "vitest";
import { normalizePartnerKey, partnerCategories, partnerInitials } from "@/lib/partners";

describe("rede de parceiros", () => {
  it("normaliza categorias com acentos", () => {
    expect(normalizePartnerKey(" Saúde ")).toBe("saude");
    expect(normalizePartnerKey("Educação")).toBe("educacao");
  });

  it("gera iniciais para logos ausentes", () => {
    expect(partnerInitials("Centro Médico ReviverClin")).toBe("CM");
    expect(partnerInitials("")).toBe("?");
  });

  it("contempla a categoria Educação usada no Notion", () => {
    expect(partnerCategories.some((category) => category.key === "educacao")).toBe(true);
  });
});
