import { useTranslation } from '@/app/i18n'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Committee from '@/models/Committee'
import { LanguageCode } from '@/models/Language'
import Link from 'next/link'
import { JSX } from 'react'

interface Props {
  language: LanguageCode
  committees: Committee[] | null
}

/**
 * @name filteredCommittees
 * @description Filters out committees with no media
 *
 * @param {Committee[]} committees - The committees to filter
 * @returns {Committee[]} The filtered committees
 */
function filteredCommittees(committees: Committee[]): Committee[] {
  return committees.filter((committee) => committee.total_media > 0)
}

/**
 * @name MediaGridView
 * @description A component displaying a grid of committees with media
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee[] | null} props.committees - The committees or null
 *
 * @returns {Promise<JSX.Element>} The media grid view component
 */
export default async function MediaGridView({
  language,
  committees,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'media')

  if (!committees) {
    return <></>
  }

  const filtered = filteredCommittees(committees)
  return (
    <section className={`${filtered.length === 0 ? 'hidden' : 'px-10 py-2'}`}>
      <h2 className='text-2xl font-bold capitalize'>{t('committees')}</h2>
      <ul className='flex flex-wrap gap-4 py-2'>
        {filtered
          .sort((a, b) => b.total_media - a.total_media)
          .map((committee, index) => (
            <li
              key={index}
              className='w-72 h-fit rounded-md border overflow-hidden relative hover:scale-105 transition-transform duration-500 cursor-pointer'
            >
              <Link
                href={`./media/${encodeURIComponent(
                  committee.translations[0].title.toLowerCase()
                )}`}
                className='w-full py-2 px-1 flex items-center gap-2'
              >
                <Avatar className='bg-white rounded-full overflow-hidden'>
                  <AvatarImage
                    className='h-10 w-auto aspect-square object-fill p-1.5'
                    width={128}
                    height={128}
                    src={committee.logo_url ?? ''}
                  />
                  <AvatarFallback>
                    {committee.translations[0].title + ' Profile Picture'}
                  </AvatarFallback>
                </Avatar>

                <div className='flex flex-col text-start overflow-hidden'>
                  <p className='truncate'>{committee.translations[0].title}</p>
                  <span className='text-xs text-neutral-600 dark:text-neutral-300'>
                    {committee.total_media} {t('title')}
                  </span>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  )
}
