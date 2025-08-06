import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['cloudinary']
  },
  webpack: (config) => {
    config.externals.push({
      'lodash': 'lodash'
    });
    return config;
  }
};

export default nextConfig;
