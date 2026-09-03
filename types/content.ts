export const contestStatuses = [
  "publicado",
  "em-andamento",
  "autorizado",
  "banca-definida",
  "comissao-formada",
  "previsto",
  "solicitado",
  "encerrado",
] as const;

export type ContestStatus = (typeof contestStatuses)[number];
export type UserRole = "admin" | "editor";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  modality: string;
  description: string;
  price: string;
  oldPrice?: string | null;
  imageUrl: string;
  href: string;
  featured?: boolean;
  career?: string;
  acronym?: string;
  menuFeatured?: boolean;
  menuImageUrl?: string | null;
  menuOrder?: number | null;
};

export type CourseAnswer = "Sim" | "Não" | "A confirmar";

export type CourseProduct = Product & {
  contestStatus: string;
  openings: string;
  salary: string;
  registrationDate: string;
  registrationFee: string;
  education: string;
  examDate: string;
  taf: CourseAnswer;
  discursiveEssay: CourseAnswer;
  examBoard: string;
  titleExam: CourseAnswer;
  contestDescription: string;
  relatedProducts: Product[];
};

export type Contest = {
  id: string;
  slug: string;
  title: string;
  acronym: string;
  organization: string;
  career: string;
  status: ContestStatus;
  states: string[];
  scope: "estadual" | "federal" | "nacional";
  openings: string;
  salary: string;
  examBoard: string;
  positions: string[];
  summary: string;
  contentMd: string;
  requirements: string[];
  stages: string[];
  sourceLabel: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  publishedAt: string;
  product?: Product | null;
};

export type CampaignBanner = {
  id: string;
  name: string;
  desktopUrl: string;
  mobileUrl?: string | null;
  ctaLabel: string;
  callout: string;
  href: string;
};

export type Testimonial = {
  id: string;
  name: string;
  result: string;
  quote: string;
  imageUrl: string;
};

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  imageUrl: string;
};
