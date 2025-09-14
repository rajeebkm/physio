/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@physiotherapy/shared'],
    env: {
        NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:3000/api',
        NEXT_PUBLIC_WEB_URL: process.env.WEB_URL || 'http://localhost:3001',
    },
    images: {
        domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.API_URL || 'http://localhost:3000/api'}/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
