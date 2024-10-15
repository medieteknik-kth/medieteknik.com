import { GetCommitteePositions } from '@/api/committee'
import Search from '@/app/[language]/chapter/positions/client/search'
import PositionDisplay from '@/app/[language]/chapter/positions/position'
import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Props {
  language: string
}

interface Params {
  params: Props
}

export const revalidate = 2_592_000

/**
 * @name Positions
 * @description Displays all positions in the organization and allows for searching
 *
 * @param {Props} props
 * @param {string} props.language - The current language
 *
 * @returns {Promise<JSX.Element>} The positions page
 */
export default async function Positions({
  params: { language },
}: Params): Promise<JSX.Element> {
  const committeePositions = await GetCommitteePositions('committee', language)
  const independentPositions = await GetCommitteePositions(
    'independent',
    language
  )
  const { t } = await useTranslation(language, 'positions')

  if (!committeePositions || !independentPositions) {
    return <></>
  }

  return (
    <main>
      <div className='h-24 bg-black' />
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
