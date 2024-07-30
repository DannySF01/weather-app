/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const repoName = "weather-app";

const nextConfig = {
  assetPrefix: isProd ? `/${repoName}/` : "",
  basePath: isProd ? `/${repoName}` : "",
};

export default nextConfig;
