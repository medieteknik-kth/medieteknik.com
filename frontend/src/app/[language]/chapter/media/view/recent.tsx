import { GetLatestMedia } from '@/api/items'
import { useTranslation } from '@/app/i18n'
import CommitteeTag from '@/components/tags/CommitteeTag'
import StudentTag from '@/components/tags/StudentTag'
import { PhotoIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { JSX } from 'react'

interface Props {
  language: string
}

export const revalidate = 1_000_000

/**
 * @name RecentMedia
 * @description A component displaying the most recent media uploads (just images for now)
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 *
 * @returns {Promise<JSX.Element>} The recent media component
 */
export default async function RecentMedia({
  language,
}: Props): Promise<JSX.Element> {
  const latest = await GetLatestMedia(language)
  const { t } = await useTranslation(language, 'media')

  const empty = !latest || Object.keys(latest).length === 0

  return (
    <section className='px-10 py-2'>
      <h2 className='text-2xl font-bold capitalize'>{t('recent')}</h2>
      {empty ? (
        <p>{t('no_media')}</p>
      ) : (
        <section className='flex flex-col justify-center gap-2 my-0.5'>
          <div className='flex items-center gap-2 my-0.5'>
            <PhotoIcon className='w-6 h-6' />
            <h3 className='text-lg font-semibold'>{t('images')}</h3>
          </div>
          <ul className='w-fit flex gap-4 pb-4'>
            {latest
              .filter((item) => item.media_type === 'image')
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((item, index) => (
                <li key={index} className='group'>
                  <Link
                    href={item.media_url}
                    target='_blank'
                    className='group w-72 h-auto aspect-video relative rounded-md block hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-500'
                  >
                    <Image
                      src={item.media_url}
                      alt={item.translations[0].title}
                      width={288}
                      height={288}
                      priority
                      loading='eager'
                      className='group w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-500 rounded-md'
                    />
                  </Link>
                  <div className='group w-full h-fit flex flex-col px-1 pb-1'>
                    <p className='text-lg font-semibold py-1'>
                      {item.translations[0].title}
                    </p>
                    {item.author.author_type === 'STUDENT' ? (
                      <StudentTag student={item.author} />
                    ) : item.author.author_type === 'COMMITTEE' ? (
                      <CommitteeTag
                        committee={item.author}
                        includeAt={false}
                        includeBackground={false}
                      >
                        <span className='text-sm'>
                          {new Date(item.created_at).toLocaleDateString(
                            language,
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </span>
                      </CommitteeTag>
                    ) : (
                      <p>?</p>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </section>
      )}
    </section>
  )
}
