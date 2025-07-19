import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  devIndicators: false,
  // Allow cross-origin requests from local network devices for development
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.187", // Your phone's IP address
    "192.168.1.0/24", // Allow any device on your local network (192.168.1.x)
  ],
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === "development", // Standard: disable in dev, enable in production
  sw: "/sw-custom.js",
  runtimeCaching: [
    // Exclude API routes from caching - they should always be fresh
    {
      urlPattern: /\/api\/.*/,
      handler: "NetworkOnly",
    },
    // Cache everything else with NetworkFirst strategy
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

export default pwaConfig(nextConfig);
