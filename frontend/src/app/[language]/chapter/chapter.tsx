import { Head } from '@/components/static/Static'
import { GetAllCommittees } from '@/api/committee'
import CommitteeMembers from './members'
import Committees from './committees'

export default async function Chapter({
  params: { language },
}: {
  params: { language: string }
}) {
  const data = await GetAllCommittees()

  if (!data) {
    return (
      <div className='h-96 grid place-items-center text-3xl'>No data...</div>
    )
  }

  return (
    <main
      style={{
        scrollPaddingTop: '-20rem !important',
        scrollMarginTop: '-20rem !important',
      }}
    >
      <div className='h-24 bg-black' />
      <Head
        title='Chapter'
        description="The Chapter's purpose is to satisfy the needs of Media Technology students during their time at KTH."
      />

      <Committees language={language} committees={data} />

      <CommitteeMembers language={language} />
    </main>
  )
}
