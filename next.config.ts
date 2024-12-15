import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    async rewrites() {
        return [
            {
                source: '/uploads/:filename',
                destination: '/api/upload/:filename', // Скінчені шляхи, включаючи підкаталоги
            },
            {
                source: '/uploads/series/:filename', // Для доступу до відеофайлів у підкаталозі
                destination: '/api/upload/series/:filename', // API для відеофайлів
            },
        ];
    },
};

export default nextConfig;
