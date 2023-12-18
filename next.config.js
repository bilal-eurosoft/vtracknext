/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  images: {
    domains: ["vtracksolutions.s3.eu-west-2.amazonaws.com"],
  },
  compiler: {
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
