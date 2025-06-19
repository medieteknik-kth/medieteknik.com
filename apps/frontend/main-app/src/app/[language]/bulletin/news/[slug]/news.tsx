import NewsAuth from '@/app/[language]/bulletin/news/[slug]/client/auth'
import Body from '@/app/[language]/bulletin/news/[slug]/client/body'
import { useTranslation } from '@/app/i18n/client'
import HeaderGap from '@/components/header/components/HeaderGap'
import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type { StudentCommitteePositionPagination } from '@/models/Pagination'
import type Student from '@/models/Student'
import type News from '@/models/items/News'
import { format } from 'date-fns'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import type { JSX } from 'react'
import type { Descendant } from 'slate'

interface Props {
  language: LanguageCode
  news: News
  members: StudentCommitteePositionPagination | null
  previewMode?: boolean
}

/**
 * @name extractRawTextFromSlate
 * @description This function will extract the raw text from a slate editor, removes all formatting and returns the raw text,
 *   e.g. {"type":"h1","children":[{"text":"Enter a heading"}], will return "Enter a heading"
 * @param {Descendant[]} body - The body of the slate editor
 * @returns {string} The raw text from the slate editor
 * @example
 * const body = [{"type":"h1","children":[{"text":"Enter a heading"}]}]
 * const rawText = extractRawTextFromSlate(body)
 * console.log(rawText) // Enter a heading
 * @see https://docs.slatejs.org/
 */
function extractRawTextFromSlate(body: Descendant[]): string {
  const text: string[] = []
  const recurse = (node: Descendant) => {
    if ('text' in node) {
      text.push(node.text)
    }
    if ('children' in node) {
      node.children.forEach(recurse)
    }
  }
  body.forEach(recurse)
  return text.join(' ')
}

/**
 * @name estimateReadingTime
 * @description This function will estimate the reading time of a text, based on the average reading speed of 200 words per minute.
 *    200 is a generous estimate, and the actual reading speed is probably higher around 240-300 words per minute.
 * @param {string} text - The text to estimate the reading time for
 * @returns {number} The estimated reading time in minutes
 * @example
 * const text = "This is a test text"
 * const readingTime = estimateReadingTime(text)
 * console.log(readingTime) // 1
 * @see https://www.sasc.org.uk/media/4d4lsrfv/assessing-reading-and-writing-speeds-presentation-june-2020.pdf
 */
function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const numberOfWords = text.split(/\s/g).length
  return Math.ceil(numberOfWords / wordsPerMinute)
}

/**
 * @name NewsDisplay
 * @description This is the news display component, it will render the news data
 *
 * @param {object} props
 * @param {string} props.language - The language of the news
 * @param {News} props.news_data - The news data
 *
 * @returns {JSX.Element} The news display component
 */
export default function NewsDisplay({
  language,
  news,
  members,
  previewMode,
}: Props): JSX.Element {
  const readingTime = estimateReadingTime(
    extractRawTextFromSlate(JSON.parse(news.translations[0].body))
  )
  const { t } = useTranslation(language, 'news')
  return (
    <>
      <HeaderGap />
      <Breadcrumb className='w-full h-fit border-b px-4 py-2'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className='py-2'>
              <Link href={`/${language}/bulletin`}>{t('bulletin')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild className='py-2'>
              <Link href={`/${language}/bulletin/news`}>{t('news')}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='py-2'>
            {news.translations[0].title}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='container mx-auto px-4 py-8 desktop:max-w-[105rem]'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <article className='lg:col-span-2 space-y-6'>
            {previewMode ? (
              <div className='relative aspect-[16/9] w-full max-h-[50vh] overflow-hidden rounded-lg bg-muted border'>
                <div className='w-full h-full absolute left-0 top-0 z-20 bg-black/50 opacity-0 hover:opacity-100 transition-opacity select-none'>
                  <p className='absolute bottom-20 text-center w-full text-2xl font-bold text-white'>
                    {t('preview_image')}
                    <br />
                    <span className='text-base'>{t('aspect_16_9')}</span>
                  </p>
                </div>
                <Image
                  src={
                    'https://storage.googleapis.com/medieteknik-static/static/16x9.webp'
                  }
                  alt='Preview image'
                  width={1920}
                  height={1080}
                  quality={80}
                  priority
                  className='w-full h-auto object-cover absolute my-auto bottom-0 top-0'
                />
              </div>
            ) : (
              news.translations[0].main_image_url && (
                <div className='relative aspect-[16/9] w-full max-h-[50vh] overflow-hidden rounded-lg bg-muted'>
                  <Image
                    src={news.translations[0].main_image_url}
                    alt={news.translations[0].title}
                    width={1366}
                    height={768}
                    sizes='(min-width: 1024px) 1024px, 66vw'
                    quality={80}
                    priority
                    loading='eager'
                    className='w-auto h-full absolute mx-auto left-0 right-0 z-10 object-cover'
                  />
                  <Image
                    src={news.translations[0].main_image_url}
                    alt={news.translations[0].title}
                    width={100}
                    height={100}
                    sizes='(min-width: 1024px) 1024px, 66vw'
                    quality={0}
                    loading='lazy'
                    className='w-full h-auto object-cover absolute my-auto bottom-0 top-0 blur-xl brightness-90'
                  />
                </div>
              )
            )}
            <div className='flex justify-between items-center text-sm text-muted-foreground'>
              <time
                dateTime={new Date(news.created_at).toDateString()}
                title={new Date(news.created_at).toLocaleDateString(language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              >
                {format(news.created_at, 'MMMM d, yyyy')}
              </time>
              <span>{`${readingTime} ${t('min_read')}`}</span>
            </div>
            <header className='space-y-2'>
              <h1 className='text-4xl font-bold tracking-tight'>
                {news.translations[0].title}
              </h1>
            </header>
            {news.categories && news.categories.length > 1 && (
              <div className='w-full h-fit'>
                <ul className='flex min-h-10 h-fit py-2'>
                  {news.categories.map((category) => (
                    <li className='px-2 py-1 border rounded-2xl' key={category}>
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Body body={news.translations[0].body} />
          </article>
          <aside className='lg:col-span-1'>
            <address className='sticky top-32 space-y-4 not-italic'>
              <div className='text-2xl font-bold'>
                {members ? (
                  <CommitteeTag
                    committee={news.author as Committee}
                    language={language}
                    includeImage
                  />
                ) : (
                  <h2>{t('author')}</h2>
                )}
              </div>
              <ul className='space-y-2 overflow-x-auto'>
                {members ? (
                  members.items
                    .sort((a, b) => a.position.weight - b.position.weight)
                    .map((member) => (
                      <li
                        key={`${member.position.committee_position_id}_${member.student.student_id}`}
                        className='text-sm'
                      >
                        <StudentTag
                          student={member.student}
                          language={language}
                          includeImage
                          size={30}
                        >
                          <p className='text-xs text-muted-foreground'>
                            {member.position.translations[0].title}
                          </p>
                        </StudentTag>
                      </li>
                    ))
                ) : (
                  <StudentTag
                    student={news.author as Student}
                    language={language}
                    includeImage
                    size={30}
                  >
                    <p className='text-xs text-muted-foreground'>Author</p>
                  </StudentTag>
                )}
              </ul>
              {!previewMode && (
                <NewsAuth language={language} news_data={news} />
              )}
            </address>
          </aside>
        </div>
      </div>
    </>
  )
}
