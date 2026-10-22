import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    assetPrefix: "",
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
 };

export default nextConfig;