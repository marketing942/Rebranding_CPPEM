import type { Metadata } from "next";
import { Inter, Oxanium, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-body", subsets: ["latin"] });
const oxanium = Oxanium({ variable: "--font-display", subsets: ["latin"] });
const rajdhani = Rajdhani({ variable: "--font-ui", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cppem.com.br"),
  title: { default: "CPPEM Concursos", template: "%s | CPPEM" },
  description: "Preparação estratégica para concursos policiais, com direção, constância e acompanhamento.",
  applicationName: "CPPEM Concursos",
  openGraph: { title: "CPPEM Concursos", description: "A preparação começa antes do edital.", type: "website", locale: "pt_BR" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="pt-BR" className={`${inter.variable} ${oxanium.variable} ${rajdhani.variable}`}><body>{children}</body></html>;
}
