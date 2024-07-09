import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['*/chapter/*', '*/documents/*'],
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://localhost:3000/sitemap.xml',
    host: 'localhost:3000',
  };
}