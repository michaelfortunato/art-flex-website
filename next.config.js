/** @type {import('next').NextConfig} */
// Get NODE_ENV="dev" when running npm run dev. Right now it does not.
const rewrites =
  process.env.NODE_ENV !== "dev"
    ? [
        {
          source: "/api/:path*",
          destination: "http://api-gateway.art-flex-apps/:path*"
        },
        {
          source: "/api/account/:path*",
          destination: "http://account-app.art-flex-apps/:path*"
        }
      ]
    : [];

module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  async rewrites() {
    return rewrites;
  }
};
