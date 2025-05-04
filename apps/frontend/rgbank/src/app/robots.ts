import type { MetadataRoute } from 'next'

/**
 * @name robots
 * @description Generate the robots.txt file for the site
 *
 * @returns {MetadataRoute.Robots} The robots.txt configuration
 */
export default function robots(): MetadataRoute.Robots {
  // This app shouldn't be indexed by search engines
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/'],
      },
    ],
    host: 'https://rgbank.medieteknik.com',
  }
}
