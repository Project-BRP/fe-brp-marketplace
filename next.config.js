/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001", // Sesuaikan port jika backend Anda berjalan di port lain
        pathname: "/uploads/**", // Sesuaikan path jika perlu
      },
      {
        protocol: "https",
        hostname: "example.com", // Added hostname for example.com
        pathname: "/images/**", // Adjusted path for example.com images
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
