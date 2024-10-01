import { HeadComponent } from '@/components/static/Static'
import { GetAllCommittees } from '@/api/committee'
import CommitteeMembers from './members'
import Committees from './committees'
import { GetCommitteeMembers } from '@/api/student'
import CommitteeMembersDisplay from './memberDisplay'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from '@/app/i18n'

export default async function Chapter({
  params: { language },
}: {
  params: { language: string }
}) {
  const data = await GetAllCommittees()
  const members = await GetCommitteeMembers(language, '2024-2025')
  const { t } = await useTranslation(language, 'chapter')

  if (!data) {
    return (
      <div className='h-96 grid place-items-center text-3xl'>
        {t('no_data')}
      </div>
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
      <HeadComponent title={t('title')} description={t('description')} />

      <Committees language={language} committees={data} />

      <section className='px-4 sm:px-20 mb-10'>
        <div className='w-full lg:w-1/2 flex flex-col md:flex-row items-center gap-4 border-b-2 border-yellow-400 pb-4 mb-4'>
          <h1 className='uppercase tracking-wider font-semibold text-2xl sm:text-4xl block'>
            {t('officials')}
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
