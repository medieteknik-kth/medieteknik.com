import { getAllCommittees } from '@/api/committee'
import { getNewsPagniation } from '@/api/items/news'
import { SUPPORTED_LANGUAGES } from '@/utility/Constants'
import type { MetadataRoute } from 'next'

/**
 * @name sitemap
 * @description Generate the sitemap.xml file for the site
 *
 * @returns {MetadataRoute.Sitemap} The sitemap.xml configuration
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: news } = await getNewsPagniation('en', 1)
  const { data: committees } = await getAllCommittees('en')

  const newsUrls = news?.items.map(
    (item) =>
      SUPPORTED_LANGUAGES.map((language) => ({
        url: `https://www.medieteknik.com/${language}/bulletin/news/${encodeURI(
          item.url
        )}`,
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
            'x-default': `https://www.medieteknik.com/bulletin/news/${encodeURI(
              item.url
            )}`,
          },
        },
      })) || []
  )

  const committeeUrls = committees?.map(
    (committee) =>
      SUPPORTED_LANGUAGES.map((language) => ({
        url: `https://www.medieteknik.com/${language}/chapter/committees/${encodeURI(
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
            'x-default': `https://www.medieteknik.com/chapter/committees/${encodeURI(
              committee.translations[0].title.toLowerCase()
            )}`,
          },
        },
      })) || []
  )

  return [
    ...SUPPORTED_LANGUAGES.flatMap((language) => [
      {
        url: `https://www.medieteknik.com/${language}`,
        changeFrequency: 'never' as const,
        priority: 1.0,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en',
            sv: 'https://www.medieteknik.com/sv',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/bulletin`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/bulletin',
            sv: 'https://www.medieteknik.com/sv/bulletin',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/bulletin/news`,
        changeFrequency: 'monthly' as const,
        priority: 0.4,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/bulletin/news',
            sv: 'https://www.medieteknik.com/sv/bulletin/news',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/chapter`,
        changeFrequency: 'yearly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/chapter',
            sv: 'https://www.medieteknik.com/sv/chapter',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/chapter/committees`,
        changeFrequency: 'yearly' as const,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/chapter/committees',
            sv: 'https://www.medieteknik.com/sv/chapter/committees',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/chapter/positions`,
        changeFrequency: 'yearly' as const,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/chapter/positions',
            sv: 'https://www.medieteknik.com/sv/chapter/positions',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/chapter/documents`,
        changeFrequency: 'monthly' as const,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/chapter/documents',
            sv: 'https://www.medieteknik.com/sv/chapter/documents',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/chapter/graphic`,
        changeFrequency: 'never' as const,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/chapter/graphic',
            sv: 'https://www.medieteknik.com/sv/chapter/graphic',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/chapter/media`,
        changeFrequency: 'monthly' as const,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/chapter/media',
            sv: 'https://www.medieteknik.com/sv/chapter/media',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/education`,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/education',
            sv: 'https://www.medieteknik.com/sv/education',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/login`,
        changeFrequency: 'never' as const,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/login',
            sv: 'https://www.medieteknik.com/sv/login',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/privacy`,
        changeFrequency: 'yearly' as const,
        lastModified: new Date('2024-10-23'),
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/privacy',
            sv: 'https://www.medieteknik.com/sv/privacy',
          },
        },
      },
      {
        url: `https://www.medieteknik.com/${language}/contact`,
        changeFrequency: 'never' as const,
        alternates: {
          languages: {
            en: 'https://www.medieteknik.com/en/contact',
            sv: 'https://www.medieteknik.com/sv/contact',
          },
        },
      },
    ]),
    ...(committeeUrls ? committeeUrls.flat() : []),
    ...(newsUrls ? newsUrls.flat() : []),
  ]
}
