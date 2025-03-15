import { getNewsPagniation } from '@/api/items/news'
import HeaderGap from '@/components/header/components/HeaderGap'
import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type Student from '@/models/Student'
import type News from '@/models/items/News'
import { Link } from 'next-view-transitions'
import dynamic from 'next/dynamic'
import Image from 'next/image'
const AllNews = dynamic(
  () => import('@/app/[language]/bulletin/news/client/allNews')
)

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

/**
 * @name NewsPage
 * @description This component is used to display the news page.
 *
 * @param {Params} params
 * @param {string} params.language - The language of the news
 *
 */
export default async function NewsPage(props: Props) {
  const { language } = await props.params
  const { data: paginatedNews, error } = await getNewsPagniation(language, 1)

  if (error) {
    return (
      <div className='h-96 grid place-items-center text-3xl'>No data...</div>
    )
  }

  paginatedNews.items = paginatedNews.items as News[]
  const firstNewsWithImage = paginatedNews.items.find(
    (news) => news.translations[0].main_image_url
  )

  return (
    <main className='container'>
      <HeaderGap />
      <h1 className='text-4xl font-bold mb-3 mt-4'>News</h1>
      <div className='w-full mb-4 max-h-2xl h-fit'>
        {firstNewsWithImage && (
          <div id='first-news' className='flex gap-4'>
            <Link
              href={`/${language}/bulletin/news/${firstNewsWithImage.url}`}
              className='w-1/3'
            >
              <Image
                src={firstNewsWithImage.translations[0].main_image_url}
                alt={firstNewsWithImage.translations[0].title}
                width={500}
                height={500}
                className='object-cover w-full rounded-md border'
              />
            </Link>
            <div className='p-4 flex flex-col gap-4 h-fit'>
              <div className='flex gap-2 items-center'>
                {firstNewsWithImage.author.author_type === 'COMMITTEE' ? (
                  <CommitteeTag
                    committee={firstNewsWithImage.author as Committee}
                    language={language}
                    includeImage
                  />
                ) : firstNewsWithImage.author.author_type === 'STUDENT' ? (
                  <StudentTag
                    student={firstNewsWithImage.author as Student}
                    language={language}
                    includeImage
                  />
                ) : (
                  <p>By </p>
                )}
                <span className='-ml-2 select-none'>&bull;</span>
                <p>
                  {new Date(firstNewsWithImage.created_at).toLocaleDateString(
                    undefined,
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }
                  )}
                </p>
              </div>
              <Link
                href={`/${language}/bulletin/news/${firstNewsWithImage.url}`}
                className='hover:underline'
              >
                <h2 className='w-fit text-6xl font-bold mb-4'>
                  {firstNewsWithImage.translations[0].title}
                </h2>
                <p>{firstNewsWithImage.translations[0].short_description}</p>
              </Link>
            </div>
          </div>
        )}
      </div>
      <AllNews language={language} data={paginatedNews} />
    </main>
  )
}
