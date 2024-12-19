import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import Colors from './client/colors'
import Documents from './documents'
import Iconography from './iconography'
import Typography from './typography'

import type { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

/**
 * @name GraphicalIdentity
 * @description Display the graphical identity of the chapter
 *
 * @param {Params} params - The dynamic parameters of the URL
 * @param {string} params.language - The currently selected language
 * @returns {Promise<JSX.Element>} The graphical identity of the chapter
 */
export default async function GraphicalIdentity(
  props: Props
): Promise<JSX.Element> {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'graphic')
  return (
    <main>
      <HeadComponent title={t('title')} />
      <Documents language={language} />
      <Iconography language={language} />
      <Colors language={language} />
      <Typography language={language} />
    </main>
  )
}
