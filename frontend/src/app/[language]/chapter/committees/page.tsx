import { Head } from '@/components/static/Static'
import Logo from 'public/images/logo.png'
import { API_BASE_URL } from '@/utility/Constants'
import Image from 'next/image'
import Link from 'next/link'
import Committee, { CommitteeCategory } from '@/models/Committee'
import {
  GetCommitteeCategories,
  GetCommitteeCategoryCommittees,
} from '@/api/committee'

interface CommitteeCategoryWithCommittees extends CommitteeCategory {
  committees: Committee[]
}

export default async function Committees({
  params: { language },
}: {
  params: { language: string }
}) {
  const committeeCategories = await GetCommitteeCategories(language)
  const categoriesWithCommittees: CommitteeCategoryWithCommittees[] = []

  if (!committeeCategories) {
    return <div>Not found</div>
  }

  for (const committeeCategory of committeeCategories) {
    const committees = (await GetCommitteeCategoryCommittees(
      committeeCategory.translations[0].title,
      language
    )) as CommitteeCategoryWithCommittees | null
    if (committees) {
      categoriesWithCommittees.push({
        email: committeeCategory.email,
        translations: committeeCategory.translations,
        committees: committees.committees,
      })
    }
  }

  if (categoriesWithCommittees.length === 0) {
    return <div>Not found</div>
  }

  return (
    <main>
      <div className='h-24 bg-black' />
      <Head title='Committees' />

      <div className='w-fit flex flex-col py-10 px-20 xl:px-52 desktop:px-96'>
        {categoriesWithCommittees.map((data, index) => (
          <section
            key={index}
            className='w-fit h-fit flex flex-col mb-10 last:mb-0'
          >
            <h2 className='text-4xl uppercase tracking-wider border-b-2 border-yellow-400 pb-4'>
              {data.translations[0].title}
            </h2>
            <div
              className={`w-fit h-fit *:h-[200px] flex flex-wrap py-4 gap-4`}
            >
              {data.committees
                .sort((a, b) =>
                  a.translations[0].title.localeCompare(b.translations[0].title)
                )
                .map((committee, index) => (
                  <Link
                    href={`./committees/${committee.translations[0].title.toLowerCase()}`}
                    title={committee.translations[0].title}
                    aria-label={committee.translations[0].title}
                    key={index}
                    className='w-[220px] relative rounded-t-lg border transition-transform hover:scale-110 hover:hover:font-bold'
                  >
                    <Image
                      src={committee.logo_url || Logo.src}
                      alt={`${committee.translations[0].title}icon`}
                      width={300}
                      height={300}
                      className='w-[120px] h-auto absolute -top-8 left-0 right-0 bottom-0 m-auto'
                    />
                    <h3 className='uppercase text-sm bg-[#232323] py-2 text-white absolute bottom-0 w-full text-center'>
                      {committee.translations[0].title}
                    </h3>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
