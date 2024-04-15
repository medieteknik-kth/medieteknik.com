/** @type {import('next').NextConfig} */

module.exports = {
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