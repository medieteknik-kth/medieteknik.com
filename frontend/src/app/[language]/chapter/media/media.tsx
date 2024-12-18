import { getAllCommittees } from '@/api/committee'
import { getAlbums } from '@/api/items/media'
import MediaToolbar from '@/app/[language]/chapter/media/components/toolbar/toolbar'
import Album from '@/app/[language]/chapter/media/view/album'
import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import { HeadComponent } from '@/components/static/Static'
import { LanguageCode } from '@/models/Language'
import { JSX } from 'react'
import MediaGridView from './view/committee'
import RecentMedia from './view/recent'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

/**
 * @name Media
 * @description The main media page, displaying all media content
 *
 * @param {Props} props
 * @param {Promise<Params>} props.params - the dynamic parameters of the URL
 * @param {string} props.params.language - The language of the page
 *
 * @returns {Promise<JSX.Element>} The media page
 */
export default async function Media(props: Props): Promise<JSX.Element> {
  const { language } = await props.params
  const { data: committees } = await getAllCommittees('sv')
  const { data: albums } = await getAlbums(language)
  const { t } = await useTranslation(language, 'media')

  return (
    <main>
      <HeaderGap />
      <HeadComponent title={t('title')} />
      <MediaToolbar language={language} />
      <MediaGridView language={language} committees={committees} />
      <Album language={language} albums={albums} />
      <RecentMedia language={language} />
    </main>
  )
}
