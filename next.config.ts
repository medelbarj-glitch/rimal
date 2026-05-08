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
};

export default withNextIntl(nextConfig);
