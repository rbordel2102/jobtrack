import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  output:
    process.env.JOBTRACK_STANDALONE_BUILD === "true"
      ? "standalone"
      : undefined,
};

export default nextConfig;
