import { GetAllCommittees } from '@/api/committee'
import { GetAlbums } from '@/api/items'
import MediaToolbar from '@/app/[language]/chapter/media/components/toolbar/toolbar'
import Album from '@/app/[language]/chapter/media/view/album'
import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import { HeadComponent } from '@/components/static/Static'
import { JSX } from 'react'
import MediaGridView from './view/committee'
import RecentMedia from './view/recent'

interface Params {
  language: string
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
  const committees = await GetAllCommittees('sv')
  const albums = await GetAlbums(language)
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
