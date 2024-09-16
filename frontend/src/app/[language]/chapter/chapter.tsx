import { Head } from '@/components/static/Static'
import { GetAllCommittees } from '@/api/committee'
import CommitteeMembers from './members'
import Committees from './committees'
import { GetCommitteeMembers } from '@/api/student'
import CommitteeMembersDisplay from './memberDisplay'
import { Separator } from '@/components/ui/separator'

export default async function Chapter({
  params: { language },
}: {
  params: { language: string }
}) {
  const data = await GetAllCommittees()
  const members = await GetCommitteeMembers(language, '2024-2025')

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

      <section className='px-4 sm:px-20 mb-10'>
        <div className='w-full lg:w-1/2 flex flex-col md:flex-row items-center gap-4 border-b-2 border-yellow-400 pb-4 mb-4'>
          <h1 className='uppercase tracking-wider font-semibold text-2xl sm:text-4xl block'>
            Officials
          </h1>
          {/* TODO: Add Year Select */}
        </div>
        {members && (
          <CommitteeMembersDisplay language={language} members={members} />
        )}
      </section>
    </main>
  )
}
