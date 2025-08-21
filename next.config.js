/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.qiqioberon.my.id", // Wildcard untuk semua subdomain qiqioberon
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001", // Sesuaikan port jika backend Anda berjalan di port lain
        pathname: "/uploads/**", // Sesuaikan path jika perlu
      },
      {
        protocol: "https", // Ganti ke http jika backend production Anda tidak pakai https
        hostname: "api.qiqioberon.my.id",
        port: "", // Kosongkan jika pakai port default (443 untuk https)
        pathname: "/uploads/**", // Pastikan path ini sesuai
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; // Perbaikan: Gunakan module.exports
