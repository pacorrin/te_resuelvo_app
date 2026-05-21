import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "typeorm",
    "mysql2",
    "reflect-metadata",
    "nodemailer",
  ],
  // Server Actions default body limit is 1 MB; incidence evidence / quotes need more.
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
