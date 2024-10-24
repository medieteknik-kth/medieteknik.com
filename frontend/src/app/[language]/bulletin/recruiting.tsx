import RecruitmentCard from '@/app/[language]/bulletin/components/recruitmentCard'
import { useTranslation } from '@/app/i18n'
import { CommitteePositionRecruitment } from '@/models/Committee'

import type { JSX } from 'react'

interface Props {
  language: string
  data: CommitteePositionRecruitment[]
}

/**
 * @name Recruitment
 * @description Renders the recruitment section of the bulletin.
 *
 * @param {Props} props -
 * @param {string} props.language - The language of the bulletin.
 * @param {Response[]} props.data - The recruitment data.
 *
 * @returns {Promise<JSX.Element>} The recruitment section of the bulletin.
 */
export default async function Recruitment({
  language,
  data,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'bulletin')

  return (
    <section
      id='recruitment'
      className='w-full h-fit flex flex-col justify-between relative mt-10'
    >
      <h2 className='uppercase text-neutral-600 dark:text-neutral-400 py-2 text-lg tracking-wide'>
        {t('recruitment')}
      </h2>
      <div className='w-full h-fit flex items-center mb-20'>
        <div className='w-full h-fit overflow-x-auto'>
          <div className='w-full h-fit flex flex-wrap gap-4'>
            {data.length === 0 && (
              <p
                className='w-full h-[200px] grid place-items-center z-10 
          uppercase tracking-wider text-neutral-800 dark:text-neutral-300 
          select-none bg-neutral-100 dark:bg-neutral-800'
              >
                {t('no_recruitment')}
              </p>
            )}
            {data.length > 0 &&
              data
                .sort(
                  (a, b) =>
                    new Date(a.end_date).getTime() -
                    new Date(b.end_date).getTime()
                )
                .map((recruit, index) => (
                  <RecruitmentCard
                    key={index}
                    language={language}
                    recruitment={recruit}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  )
}
