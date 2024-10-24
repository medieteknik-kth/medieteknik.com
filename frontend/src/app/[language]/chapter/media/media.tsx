import { GetAllCommittees } from '@/api/committee'
import HeaderGap from '@/components/header/components/HeaderGap'
import { HeadComponent } from '@/components/static/Static'
import MediaGridView from './view/committee'
import RecentMedia from './view/recent'

interface Params {
  language: string
}

interface Props {
  params: Promise<Params>
}

export default async function Media(props: Props) {
  const { language } = await props.params
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
