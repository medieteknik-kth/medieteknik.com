/** @type {import('next').NextConfig} */

module.exports = {
    productionBrowserSourceMaps: true,
    typescript: {
        ignoreBuildErrors: true, // TODO: Remove this line when all errors are fixed
    },
    images: {
        remotePatterns: [
            {
                hostname: 'storage.googleapis.com',
                protocol: 'https',
            },
            {
                hostname: 'www.medieteknik.com',
                protocol: 'https',
            }
        ]
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                ],
            }
        ]
    },

    webpack(config) {

        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg')
        );

        if (fileLoaderRule) {
            // Exclude SVGs from the existing rule
            fileLoaderRule.exclude = /\.svg$/i;

            // Add new rule for handling SVGs with `@svgr/webpack`
            config.module.rules.push({
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [/url/] },
                use: ['@svgr/webpack']
            });

            // Add or adjust rule for using SVGs as URLs
            config.module.rules.push({
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/,
            });
        }
        return config;
    }
};