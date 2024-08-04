/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

const repoName = "weather-app";

const pwa = withPWA({
  dest: "public",
  disable: !isProd,
});

const nextConfig = pwa({
  output: "export",
  assetPrefix: isProd ? `/${repoName}/` : "",
  basePath: isProd ? `/${repoName}` : "",
  trailingSlash: true,
});

export default nextConfig;
