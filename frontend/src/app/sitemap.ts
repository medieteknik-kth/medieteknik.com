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
      url: 'https://localhost:3000/',
      lastModified: new Date(),
      priority: 1.0,
      alternates: {
        languages: {
          en: 'https://localhost:3000/en',
          sv: 'https://localhost:3000/sv'
        }
      }
    },
    {
      url: 'https://localhost:3000/bulletin',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          en: 'https://localhost:3000/en/bulletin',
          sv: 'https://localhost:3000/sv/bulletin'
        }
      }
    },
    {
      url: 'https://localhost:3000/chapter',
      lastModified: new Date(),
      priority: 0.7,
      alternates: {
        languages: {
          en: 'https://localhost:3000/en/chapter',
          sv: 'https://localhost:3000/sv/chapter'
        }
      }
    },
    {
      url: 'https://localhost:3000/education',
      lastModified: new Date(),
      priority: 0.6,
      alternates: {
        languages: {
          en: 'https://localhost:3000/en/education',
          sv: 'https://localhost:3000/sv/education'
        }
      }
    }
  ]
}