import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
