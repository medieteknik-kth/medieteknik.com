import { getCommitteePositions } from '@/api/committee_position'
import Search from '@/app/[language]/chapter/positions/client/search'
import PositionDisplay from '@/app/[language]/chapter/positions/positionDisplay'
import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import { HeadComponent } from '@/components/static/Static'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import type { JSX } from 'react'

interface Params {
  language: string
}

interface Props {
  params: Promise<Params>
}

export const revalidate = 2_592_000 // 30 days

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
  const committeePositions = await GetCommitteePositions('committee', language)
  const independentPositions = await GetCommitteePositions(
    'independent',
    language
  )
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
      <HeaderGap />
      <HeadComponent title={t('title')} />
      <Search
        language={language}
        data={[...committeePositions, ...independentPositions]}
      />
      <Accordion
        type='multiple'
        className='px-20 py-4 flex flex-col gap-10'
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
                .map((position, index) => (
                  <li key={index}>
                    <PositionDisplay language={language} position={position} />
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
              {independentPositions.map((position, index) => (
                <li key={index}>
                  <PositionDisplay language={language} position={position} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}
