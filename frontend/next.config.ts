import type { NextConfig } from "next";

const imageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || "res.cloudinary.com,placehold.co")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
