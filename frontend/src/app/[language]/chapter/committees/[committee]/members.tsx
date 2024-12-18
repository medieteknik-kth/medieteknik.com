import { getCommitteeMembers } from '@/api/committee'

import StudentCommitteCard from '@/components/cards/StudentCard'
import { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'


interface Props {
  language: LanguageCode
  committee: string
}

/**
 * @name CommitteeMembers
 * @description The page for displaying the members of a committee
 *
 * @param {object} param - The dynamic URL parameters
 * @param {string} param.language - The language of the page
 * @param {string} param.committee - The committee name to display the members of
 * @returns {Promise<JSX.Element>} The rendered server component
 */
export default async function CommitteeMembers({
  language,
  committee,
}: Props): Promise<JSX.Element> {
  const { data: members, error } = await getCommitteeMembers(
    committee,
    language,
    1
  )
  const committeeName = decodeURIComponent(committee)

  if (error || members.total_items === 0) {
    return (
      <section className='h-96'>
        <div className='h-full pt-12 mb-10 grid place-items-center'>
          <h2 className='text-xl md:text-3xl capitalize text-center'>
            No members in <span className='font-bold'>{committeeName}</span>
          </h2>
        </div>
      </section>
    )
  }

  return (
    <section className='min-h-96 h-fit relative'>
      <div className='pt-12 mb-10 grid place-items-center'>
        <h2 className='text-lg md:text-2xl lg:text-3xl capitalize'>
          Meet <span className='font-bold'>{committeeName}</span>
        </h2>
      </div>
      <div className='w-full h-full flex flex-wrap gap-4 justify-center grid-flow-row px-12 mb-6'>
        {members.items
          .sort((a, b) => a.position.weight - b.position.weight)
          .map((member, index) => (
            <StudentCommitteCard
              key={index}
              member={member}
              committeeLogo={false}
            />
          ))}
      </div>
    </section>
  )
}
