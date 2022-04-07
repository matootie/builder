/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "https://admin.builder.matootie.com",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
