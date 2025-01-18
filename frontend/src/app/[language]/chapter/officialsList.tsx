'use client'

import StudentCommitteCard from '@/components/cards/StudentCard'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { CommitteePositionCategory } from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import type { StudentCommitteePosition } from '@/models/Student'

interface Props {
  language: LanguageCode
  members: StudentCommitteePosition[]
}

export default function OfficialsList({ language, members }: Props) {
  const categories: CommitteePositionCategory[] = [
    'STYRELSEN',
    'STUDIESOCIALT',
    'NÄRINGSLIV OCH KOMMUNIKATION',
    'UTBILDNING',
    'VALBEREDNINGEN',
    'KÅRFULLMÄKTIGE',
    'REVISORER',
    'FANBORGEN',
  ]

  const memberCategories = categories.map((category) => {
    return {
      name: category,
      members: members.filter(
        (member) => member.position.category === category
      ),
    }
  })

  return (
    <Accordion
      type='multiple'
      id='officials'
      className='w-full flex flex-col gap-2'
      defaultValue={categories}
    >
      {categories.map((category) => (
        <AccordionItem
          value={category}
          key={category}
          className='odd:bg-neutral-100 dark:odd:bg-neutral-800 p-6 rounded-lg shadow-md border'
        >
          <AccordionTrigger>
            <h2 className='text-center sm:text-start text-lg sm:text-2xl uppercase text-black dark:text-primary'>
              {category}
            </h2>
          </AccordionTrigger>
          <AccordionContent className='flex flex-wrap gap-3 mt-2 justify-center'>
            {memberCategories
              .filter((member) => member.name === category)
              .map((member) =>
                member.members
                  .sort((a, b) => {
                    if (a.position.weight === b.position.weight) {
                      const titleComparison =
                        a.position.translations[0].title.localeCompare(
                          b.position.translations[0].title
                        )
                      if (titleComparison !== 0) return titleComparison
                    }
                    return a.position.weight - b.position.weight
                  })
                  .map((member) => (
                    <StudentCommitteCard
                      key={`${member.position.committee_position_id}_${member.student.student_id}`}
                      member={member}
                      committeeLogo
                    />
                  ))
              )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
