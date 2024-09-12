/** @type {import('next').NextConfig} */

module.exports = {
    productionBrowserSourceMaps: true,
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
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self' http://localhost:3000 https://medieteknik.com; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' localhost:80 http://localhost:* https://api.medieteknik.com; img-src 'self' https://storage.googleapis.com data:;",
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), usb=(), fullscreen=(self), autoplay=(), payment=(self), push=(self)',
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'same-site',
                    }
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