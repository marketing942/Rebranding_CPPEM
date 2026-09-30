export type EventStatus = "Inscrições abertas" | "Em breve" | "Lista de espera" | "Ao vivo" | "Encerrado";

export type EventItem = {
  id: string;
  name: string;
  description: string;
  href: string;
  status: EventStatus | string;
  /** data de inicio no formato AAAA-MM-DD, ou null quando ainda nao ha data */
  date: string | null;
  time: string;
  place: string;
  format: string;
  price: string;
  imageUrl: string | null;
  label: string;
  featured: boolean;
  order: number;
};
