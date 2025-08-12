import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',           // gera a pasta out
  images: { unoptimized: true }
};

export default nextConfig;
