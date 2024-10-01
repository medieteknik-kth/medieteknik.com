import { HeadComponent } from '@/components/static/Static'
import Colors from './client/colors'
import Typography from './typography'
import Iconography from './iconography'
import Documents from './documents'
import { useTranslation } from '@/app/i18n'

/**
 * @interface Props
 * @property {string} language - The currently selected language
 */
interface Props {
  language: string
}

/**
 * @interface Params
 * @property {Props} params - The dynamic parameters of the URL
 */
interface Params {
  params: Props
}

/**
 * @name GraphicalIdentity
 * @description Display the graphical identity of the chapter
 *
 * @param {Params} params - The dynamic parameters of the URL
 * @param {string} params.language - The currently selected language
 * @returns {Promise<JSX.Element>} The graphical identity of the chapter
 */
export default async function GraphicalIdentity({
  params: { language },
}: Params): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'graphic')
  return (
    <main>
      <div className='h-24 bg-black' />
      <HeadComponent title={t('title')} />
      <Documents language={language} />
      <Iconography language={language} />
      <Colors language={language} />
      <Typography language={language} />
    </main>
  )
}
