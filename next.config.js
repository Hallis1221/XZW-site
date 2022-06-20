/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
