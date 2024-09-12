import { MetadataRoute } from 'next';

/**
 * @name sitemap
 * @description Generate the sitemap.xml file for the site
 * 
 * @returns {MetadataRoute.Sitemap} The sitemap.xml configuration 
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.medieteknik.com/',
      lastModified: new Date(),
      priority: 1.0,
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en',
          sv: 'https://www.medieteknik.com/sv'
        }
      }
    },
    {
      url: 'https://www.medieteknik.com/bulletin',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/bulletin',
          sv: 'https://www.medieteknik.com/sv/bulletin'
        }
      }
    },
    {
      url: 'https://www.medieteknik.com/chapter',
      lastModified: new Date(),
      priority: 0.7,
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/chapter',
          sv: 'https://www.medieteknik.com/sv/chapter'
        }
      }
    },
    {
      url: 'https://www.medieteknik.com/education',
      lastModified: new Date(),
      priority: 0.6,
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/education',
          sv: 'https://www.medieteknik.com/sv/education'
        }
      }
    }
  ]
}