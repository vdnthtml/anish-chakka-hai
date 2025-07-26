import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BROWSERSLIST_DANGER_MODE: '1',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false }; // You might need this for other modules
    }
    // This tells webpack to not try to resolve `__dirname` dynamically at build time
    // for Node.js modules, which can help with packages like `browserslist`.
    config.node = { __dirname: true };

    return config;
  },
};

export default nextConfig;
