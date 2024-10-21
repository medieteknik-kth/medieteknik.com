import { MetadataRoute } from 'next';

/**
 * @name robots
 * @description Generate the robots.txt file for the site
 * 
 * @returns {MetadataRoute.Robots} The robots.txt configuration 
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['*/profile/*', '*/account/*', '*/manage/*', '*/admin/*'],
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://www.medieteknik.com/sitemap.xml',
    host: 'https://www.medieteknik.com',
  };
}