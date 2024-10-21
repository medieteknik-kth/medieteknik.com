import { GetAllCommittees } from '@/api/committee'
import { HeadComponent } from '@/components/static/Static'
import MediaGridView from './view/committee'
import RecentMedia from './view/recent'
import HeaderGap from '@/components/header/components/HeaderGap'

interface Props {
  language: string
}

interface Params {
  params: Props
}

export default async function Media({ params: { language } }: Params) {
  const committees = await GetAllCommittees('sv')

  if (!committees) {
    return <></>
  }

  return (
    <main>
      <HeaderGap />
      <HeadComponent title='Media' />
      <MediaGridView language={language} committees={committees} />
      <RecentMedia language={language} />
    </main>
  )
}
