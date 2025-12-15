import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactStrictMode: false,
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
