import { GetAllCommittees } from '@/api/committee'
import { GetNewsPagniation } from '@/api/items'
import { MetadataRoute } from 'next'

/**
 * @name sitemap
 * @description Generate the sitemap.xml file for the site
 *
 * @returns {MetadataRoute.Sitemap} The sitemap.xml configuration
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await GetNewsPagniation('en', 1)
  const committees = await GetAllCommittees('en')

  const newsUrls =
    news?.items.map((item) => ({
      url: `https://www.medieteknik.com/bulletin/news/${encodeURI(item.url)}`,
      changeFrequency: 'yearly' as const,
      lastModified: new Date(item.last_updated || item.created_at),
      priority: 0.9,
      alternates: {
        languages: {
          en: `https://www.medieteknik.com/en/bulletin/news/${encodeURI(
            item.url
          )}`,
          sv: `https://www.medieteknik.com/sv/bulletin/news/${encodeURI(
            item.url
          )}`,
        },
      },
    })) || []

  const committeeUrls =
    committees?.map((committee) => ({
      url: `https://www.medieteknik.com/chapter/committees/${encodeURI(
        committee.translations[0].title.toLowerCase()
      )}`,
      changeFrequency: 'yearly' as const,
      alternates: {
        languages: {
          en: `https://www.medieteknik.com/en/chapter/committees/${encodeURI(
            committee.translations[0].title.toLowerCase()
          )}`,
          sv: `https://www.medieteknik.com/sv/chapter/committees/${encodeURI(
            committee.translations[0].title.toLowerCase()
          )}`,
        },
      },
    })) || []

  return [
    {
      url: 'https://www.medieteknik.com/',
      changeFrequency: 'never',
      priority: 1.0,
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en',
          sv: 'https://www.medieteknik.com/sv',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/bulletin',
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/bulletin',
          sv: 'https://www.medieteknik.com/sv/bulletin',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/bulletin/news',
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/bulletin/news',
          sv: 'https://www.medieteknik.com/sv/bulletin/news',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter',
      changeFrequency: 'yearly',
      priority: 0.7,
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/chapter',
          sv: 'https://www.medieteknik.com/sv/chapter',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter/committees',
      changeFrequency: 'yearly',
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/chapter/committees',
          sv: 'https://www.medieteknik.com/sv/chapter/committees',
        },
      },
    },
    ...committeeUrls,
    {
      url: 'https://www.medieteknik.com/chapter/positions',
      changeFrequency: 'yearly',
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/chapter/positions',
          sv: 'https://www.medieteknik.com/sv/chapter/positions',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter/documents',
      changeFrequency: 'monthly',
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/chapter/documents',
          sv: 'https://www.medieteknik.com/sv/chapter/documents',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter/graphic',
      changeFrequency: 'never',
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/chapter/graphic',
          sv: 'https://www.medieteknik.com/sv/chapter/graphic',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/chapter/media',
      changeFrequency: 'monthly',
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/chapter/media',
          sv: 'https://www.medieteknik.com/sv/chapter/media',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/education',
      changeFrequency: 'yearly',
      priority: 0.6,
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/education',
          sv: 'https://www.medieteknik.com/sv/education',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/login',
      changeFrequency: 'never',
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/login',
          sv: 'https://www.medieteknik.com/sv/login',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/privacy',
      changeFrequency: 'yearly',
      lastModified: new Date('2024-10-23'),
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/privacy',
          sv: 'https://www.medieteknik.com/sv/privacy',
        },
      },
    },
    {
      url: 'https://www.medieteknik.com/contact',
      changeFrequency: 'never',
      alternates: {
        languages: {
          en: 'https://www.medieteknik.com/en/contact',
          sv: 'https://www.medieteknik.com/sv/contact',
        },
      },
    },
    ...newsUrls,
  ]
}
