export type FreeMaterial = {
  id: string;
  name: string;
  label: string;
  description: string;
  href: string;
  imageUrl: string | null;
  menuFeatured: boolean;
  menuOrder: number | null;
};

export type VerticalizedNotice = FreeMaterial & {
  agency: string;
  role: string;
  board: string;
  year: number | null;
};
