/** @type {import('next').NextConfig} */
// Get NODE_ENV="dev" when running npm run dev. Right now it does not.
module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });
    console.log(config.compilerOptions);
    return config;
  }
};
