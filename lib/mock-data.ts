import type { Contest, NewsItem, Product } from "@/types/content";

export const fallbackProducts: Product[] = [
  {
    id: "p1", slug: "combo-pmpe-cbmpe", name: "Combo PMPE + CBMPE", category: "Carreiras militares",
    modality: "Online • 12 meses", description: "Preparação integrada com aulas, questões, simulados e direção de estudos.",
    price: "12x de R$ 61", oldPrice: "R$ 997", imageUrl: "/images/card01.webp", href: "/cursos/combo-pmpe-cbmpe", featured: true,
  },
  {
    id: "p2", slug: "combo-pcpe-pppe", name: "Combo PCPE + PPPE", category: "Civil e penal",
    modality: "Online • 12 meses", description: "Conteúdo objetivo para quem quer disputar duas grandes oportunidades em Pernambuco.",
    price: "12x de R$ 61", oldPrice: "R$ 997", imageUrl: "/images/card02.webp", href: "/cursos/combo-pcpe-pppe",
  },
  {
    id: "p3", slug: "plano-de-combate", name: "Plano de Combate", category: "Preparação contínua",
    modality: "Online • Acesso imediato", description: "Método CPPEM com cronograma, acompanhamento e preparação estratégica.",
    price: "Conheça os planos", imageUrl: "/images/card03.webp", href: "/plano-de-combate",
  },
];

export const fallbackContests: Contest[] = [
  {
    id: "c1", slug: "pmpe-policia-militar-pernambuco", title: "Polícia Militar de Pernambuco", acronym: "PMPE",
    organization: "Polícia Militar de Pernambuco", career: "Polícia Militar", status: "autorizado", states: ["PE"], scope: "estadual",
    openings: "1.320 vagas", salary: "Até R$ 5.617,92", examBoard: "A definir", positions: ["Soldado", "Oficial"],
    summary: "Novo concurso autorizado para reforçar o efetivo da Polícia Militar de Pernambuco.",
    contentMd: "O concurso da **PMPE** integra o novo ciclo de segurança pública de Pernambuco. A preparação antecipada permite construir base nas disciplinas mais recorrentes antes da publicação do edital.",
    requirements: ["Ensino médio para Soldado", "Idade e requisitos físicos conforme edital", "CNH na categoria exigida"],
    stages: ["Prova objetiva", "Exames médicos", "Teste de aptidão física", "Avaliação psicológica e investigação social"],
    sourceLabel: "Governo de Pernambuco", sourceUrl: "https://www.pe.gov.br/", lastVerifiedAt: "2026-08-22", publishedAt: "2026-08-10", product: fallbackProducts[0],
  },
  {
    id: "c2", slug: "pcpe-policia-civil-pernambuco", title: "Polícia Civil de Pernambuco", acronym: "PCPE",
    organization: "Polícia Civil de Pernambuco", career: "Polícia Civil", status: "autorizado", states: ["PE"], scope: "estadual",
    openings: "1.315 vagas", salary: "A definir", examBoard: "A definir", positions: ["Agente", "Escrivão", "Delegado"],
    summary: "Seleção autorizada para diferentes cargos da Polícia Civil de Pernambuco.",
    contentMd: "A autorização abre uma janela importante para iniciar uma preparação consistente para a **PCPE**, especialmente nas disciplinas jurídicas e básicas.",
    requirements: ["Nível superior conforme o cargo", "CNH conforme o futuro edital"],
    stages: ["Prova objetiva", "Prova discursiva", "Exames médicos", "Investigação social", "Curso de formação"],
    sourceLabel: "Governo de Pernambuco", sourceUrl: "https://www.pe.gov.br/", lastVerifiedAt: "2026-08-22", publishedAt: "2026-08-09", product: fallbackProducts[1],
  },
  {
    id: "c3", slug: "pcal-policia-civil-alagoas", title: "Polícia Civil de Alagoas", acronym: "PCAL",
    organization: "Polícia Civil de Alagoas", career: "Polícia Civil", status: "previsto", states: ["AL"], scope: "estadual",
    openings: "A definir", salary: "Conforme novo edital", examBoard: "A definir", positions: ["Agente", "Escrivão"],
    summary: "Concurso previsto; acompanhe a evolução e os próximos atos oficiais.",
    contentMd: "O próximo concurso da **PCAL** está em acompanhamento editorial. Os dados serão atualizados somente a partir de fontes oficiais.",
    requirements: ["Nível superior conforme o futuro edital"], stages: ["Etapas a confirmar no edital"],
    sourceLabel: "Governo de Alagoas", sourceUrl: "https://alagoas.al.gov.br/", lastVerifiedAt: "2026-08-18", publishedAt: "2026-08-05", product: null,
  },
  {
    id: "c4", slug: "pmba-policia-militar-bahia", title: "Polícia Militar da Bahia", acronym: "PMBA",
    organization: "Polícia Militar da Bahia", career: "Polícia Militar", status: "previsto", states: ["BA"], scope: "estadual",
    openings: "A definir", salary: "Conforme novo edital", examBoard: "A definir", positions: ["Soldado"],
    summary: "Oportunidade acompanhada pela equipe editorial do CPPEM.", contentMd: "A página será atualizada conforme novos atos oficiais forem divulgados.",
    requirements: ["A confirmar"], stages: ["A confirmar"], sourceLabel: "Governo da Bahia", sourceUrl: "https://www.ba.gov.br/", lastVerifiedAt: "2026-08-17", publishedAt: "2026-08-01", product: null,
  },
];

export const approvedStudentImages = Array.from({ length: 14 }, (_, index) => `/images/aprovados/foto${index + 1}.webp`);

export const fallbackNews: NewsItem[] = [
  { slug: "como-comecar-estudar-concurso-policial", title: "Como começar a estudar para um concurso policial", excerpt: "Um plano prático para organizar matérias, revisões e questões desde a primeira semana.", category: "Estratégia", publishedAt: "2026-08-20", readingMinutes: 6, imageUrl: "/images/bgnews.webp" },
  { slug: "concursos-seguranca-publica-nordeste", title: "Concursos de segurança pública no Nordeste", excerpt: "Veja como acompanhar autorizações, bancas e editais sem depender de rumores.", category: "Concursos", publishedAt: "2026-08-18", readingMinutes: 5, imageUrl: "/images/policiais-operacao.webp" },
  { slug: "revisao-ativa-para-provas", title: "Revisão ativa: como lembrar mais até a prova", excerpt: "Métodos simples para revisar com constância e medir a evolução.", category: "Estudos", publishedAt: "2026-08-14", readingMinutes: 4, imageUrl: "/images/bgatirador.webp" },
];
