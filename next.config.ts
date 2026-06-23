import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase-stored photos are served from the project's storage domain.
  // Add your project ref host here once known, e.g. "<ref>.supabase.co".
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
