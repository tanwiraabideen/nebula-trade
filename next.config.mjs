/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['assets.coingecko.com', 'coin-images.coingecko.com'],
    },
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig;
