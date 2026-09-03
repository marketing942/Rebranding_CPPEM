import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/gratuito", destination: "/materiais-gratuitos", permanent: true },
      { source: "/turmas", destination: "/presencial", permanent: true },
      { source: "/cursos/presencial", destination: "/presencial", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
