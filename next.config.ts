import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static export
  basePath: "/Stealthify", // Must match your GitHub repo name
  trailingSlash: true, // Ensures proper URL handling
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
