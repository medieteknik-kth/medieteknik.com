import { getCommitteePositions } from '@/api/committee_position'
import Search from '@/app/[language]/chapter/positions/client/search'
import PositionDisplay from '@/app/[language]/chapter/positions/positionDisplay'
import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { LanguageCode } from '@/models/Language'

import type { JSX } from 'react'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

/**
 * @name Positions
 * @description Displays all positions in the organization and allows for searching
 *
 * @param {Props} props
 * @param {string} props.language - The current language
 *
 * @returns {Promise<JSX.Element>} The positions page
 */
export default async function Positions(props: Props): Promise<JSX.Element> {
  const { language } = await props.params
  const { data: committeePositions, error: committeePositionError } =
    await getCommitteePositions('committee', language)
  const { data: independentPositions, error: independentPositionError } =
    await getCommitteePositions('independent', language)
  const { t } = await useTranslation(language, 'positions')

  if (committeePositionError || independentPositionError) {
    return <></>
  }

  return (
    <main>
      <HeadComponent title={t('title')} />
      <Search
        language={language}
        data={[...committeePositions, ...independentPositions]}
      />
      <Accordion
        type='multiple'
        className='px-2 sm:px-5 md:px-20 py-4 flex flex-col gap-6'
        defaultValue={['committees']}
      >
        <AccordionItem value='committees'>
          <AccordionTrigger className='text-2xl tracking-wide'>
            {t('committees')}
          </AccordionTrigger>
          <AccordionContent>
            <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
              {committeePositions
                .sort((a, b) =>
                  a.translations[0].title.localeCompare(b.translations[0].title)
                )
                .map((position) => (
                  <li key={position.committee_position_id}>
                    <PositionDisplay position={position} />
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='independent'>
          <AccordionTrigger className='text-2xl tracking-wide'>
            {t('independent')}
          </AccordionTrigger>
          <AccordionContent>
            <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
              {independentPositions.map((position) => (
                <li key={position.committee_position_id}>
                  <PositionDisplay position={position} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}
