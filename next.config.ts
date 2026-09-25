import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/gratuito", destination: "/materiais-gratuitos", permanent: true },
      { source: "/turmas", destination: "/presencial", permanent: true },
      { source: "/cursos/presencial", destination: "/presencial", permanent: true },
      { source: "/produtos/presencial", destination: "/presencial", permanent: true },
      { source: "/cursos", destination: "/produtos", permanent: true },
      { source: "/cursos/:categoria", destination: "/produtos/:categoria", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
