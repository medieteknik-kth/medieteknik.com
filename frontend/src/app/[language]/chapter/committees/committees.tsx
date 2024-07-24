import { Head } from '@/components/static/Static'
import Logo from 'public/images/logo.webp'
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

export default async function CommitteeList({
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

      <div className='w-fit flex flex-col gap-10 py-10 sm:px-16 xl:px-52 desktop:px-96'>
        {categoriesWithCommittees.map((data, index) => (
          <section
            key={index}
            id={`${data.translations[0].title.toLowerCase()}`}
            className='w-full h-fit flex flex-col'
          >
            <h2 className='text-2xl lg:text-4xl w-full text-center sm:text-left uppercase tracking-wider border-b-2 border-yellow-400 pb-4'>
              {data.translations[0].title}
            </h2>
            <div
              className={`w-full sm:w-fit h-fit *:h-[200px] flex justify-center sm:justify-start flex-wrap py-4 gap-4`}
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
                    className='min-w-[200px] w-fit lg:w-[220px] relative rounded-t-lg border transition-transform hover:scale-110 hover:hover:font-bold bg-white'
                  >
                    <Image
                      src={committee.logo_url || Logo.src}
                      alt={`${committee.translations[0].title}icon`}
                      width={300}
                      height={300}
                      className='w-[100px] lg:w-[120px] h-auto absolute -top-8 left-0 right-0 bottom-0 m-auto'
                    />
                    <h3 className='uppercase w-[200px] lg:w-full text-xs lg:text-sm bg-[#232323] py-2 text-white absolute bottom-0 text-center px-2'>
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
