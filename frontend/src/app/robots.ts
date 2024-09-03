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
        disallow: ['*/chapter/*', '*/documents/*'],
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://www.medieteknik.com/sitemap.xml',
    host: 'www.medieteknik.com',
  };
}