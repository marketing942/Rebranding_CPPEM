import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // imagem Docker enxuta: o build gera um servidor Node autocontido
  output: "standalone",
  async redirects() {
    return [
      { source: "/gratuito", destination: "/materiais-gratuitos", permanent: true },
      { source: "/turmas", destination: "/presencial", permanent: true },
      { source: "/cursos/presencial", destination: "/presencial", permanent: true },
      { source: "/produtos/presencial", destination: "/presencial", permanent: true },
      { source: "/cursos", destination: "/produtos", permanent: true },
      { source: "/cursos/:categoria", destination: "/produtos/:categoria", permanent: true },

      // Enderecos do site anterior. Seguem vivos porque circulam em anuncio, bio,
      // WhatsApp e no indice do Google; a query (UTM) vai junto no redirect.
      { source: "/combate", destination: "/plano-de-combate", permanent: true },
      { source: "/gratuitos", destination: "/materiais-gratuitos", permanent: true },
      { source: "/material-gratuito", destination: "/materiais-gratuitos", permanent: true },
      // Destinos que podem mudar ficam como temporarios: redirect permanente
      // fica gravado no navegador e nao da para voltar atras depois.
      { source: "/login", destination: "https://plataforma.cppem.com.br", permanent: false },
      { source: "/loja", destination: "https://cppem.lojaintegrada.com.br", permanent: false },
      { source: "/faculdade-ead", destination: "https://contato.unicive.cppem.com.br/", permanent: false },
      { source: "/politica-de-privacidade", destination: "https://central-de-ajuda.cppem.com.br/artigo/duvidas-gerais/politica-de-privacidade", permanent: false },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
