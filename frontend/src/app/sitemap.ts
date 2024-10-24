import { MetadataRoute } from 'next'

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
      priority: 1.0,
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en',
          'sv-SE': 'https://www.medieteknik.com/sv',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/bulletin',
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/bulletin',
          'sv-SE': 'https://www.medieteknik.com/sv/bulletin',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/bulletin/news',
      changeFrequency: 'weekly',
      priority: 0.4,
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/bulletin/news',
          'sv-SE': 'https://www.medieteknik.com/sv/bulletin/news',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter',
      priority: 0.7,
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/chapter',
          'sv-SE': 'https://www.medieteknik.com/sv/chapter',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter/committees',
      changeFrequency: 'yearly',
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/chapter/committees',
          'sv-SE': 'https://www.medieteknik.com/sv/chapter/committees',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter/positions',
      changeFrequency: 'yearly',
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/chapter/positions',
          'sv-SE': 'https://www.medieteknik.com/sv/chapter/positions',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter/documents',
      changeFrequency: 'monthly',
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/chapter/documents',
          'sv-SE': 'https://www.medieteknik.com/sv/chapter/documents',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter/graphic',
      changeFrequency: 'never',
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/chapter/graphic',
          'sv-SE': 'https://www.medieteknik.com/sv/chapter/graphic',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter/media',
      changeFrequency: 'monthly',
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/chapter/media',
          'sv-SE': 'https://www.medieteknik.com/sv/chapter/media',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/education',
      priority: 0.6,
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/education',
          'sv-SE': 'https://www.medieteknik.com/sv/education',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/login',
      alternates: {
        languages: {
          'en-GB': 'https://www.medieteknik.com/en/login',
          'sv-SE': 'https://www.medieteknik.com/sv/login',
        },
      },
    },
  ]
}
