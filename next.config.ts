import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
    generateBuildId: async () => {
        // Force un nouvel ID de build à chaque déploiement pour vider le cache
        return 'build-' + Date.now();
    },
    experimental: {
        optimizeCss: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
