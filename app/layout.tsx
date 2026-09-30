import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter, Oxanium, Rajdhani } from "next/font/google";
import "./globals.css";
import { WhatsappFloat } from "@/components/layout/whatsapp-float";

const inter = Inter({ variable: "--font-body", subsets: ["latin"] });
const oxanium = Oxanium({ variable: "--font-display", subsets: ["latin"] });
const rajdhani = Rajdhani({ variable: "--font-ui", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cppem.com.br"),
  // a home mostra so a marca; as internas levam o nome da pagina antes dela
  title: { default: "CPPEM CONCURSOS", template: "%s | CPPEM CONCURSOS" },
  description: "Preparação estratégica para concursos policiais, com direção, constância e acompanhamento.",
  applicationName: "CPPEM CONCURSOS",
  openGraph: {
    title: "CPPEM CONCURSOS",
    siteName: "CPPEM CONCURSOS",
    description: "Preparação estratégica para concursos policiais. A preparação começa antes do edital.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPPEM CONCURSOS",
    description: "Preparação estratégica para concursos policiais. A preparação começa antes do edital.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="pt-BR" className={`${inter.variable} ${oxanium.variable} ${rajdhani.variable}`}><body>
    {/* mesmo container e mesmo servidor do site anterior: as tags do GTM seguem valendo */}
    <GoogleTagManager gtmScriptUrl="https://sgtm.cppem.com.br/metrics/" />
    {children}
    <WhatsappFloat />
    <noscript><iframe src="https://sgtm.cppem.com.br/metrics/ns.html?id=GTM-PJ379FLQ" height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
  </body></html>;
}
