/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true } // serve /public assets directly (fixes images not loading)
};
module.exports = nextConfig;
