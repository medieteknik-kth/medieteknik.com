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

export const revalidate = 60 * 60 * 24 * 30 * 3 // 3 months

export default async function CommitteeList({
  params: { language },
}: {
  params: { language: string }
}) {
  const committeeCategories = await GetCommitteeCategories(language)
  const categoriesWithCommittees: CommitteeCategoryWithCommittees[] = []

  if (!committeeCategories) {
    return (
      <main>
        <div className='h-24 bg-black' />
        <Head title='Committees' />
        <h2 className='text-center text-2xl my-8'>No committees found</h2>
        <p className='text-center my-4'>
          Contact{' '}
          <Link
            href='mailto:webmaster@medieteknik.com'
            className='text-sky-600'
          >
            webmaster@medieteknik.com
          </Link>{' '}
          for help
        </p>
      </main>
    )
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

  return (
    <main>
      <div className='h-24 bg-black' />
      <Head title='Committees' />

      <div className='w-fit flex flex-col gap-10 py-10 sm:px-16 xl:px-52 desktop:px-96 dark:bg-[#111]'>
        {categoriesWithCommittees.length === 0 && (
          <div className='w-full h-full flex justify-center items-center'>
            <h2 className='text-2xl lg:text-4xl'>No committees found</h2>
          </div>
        )}
        {categoriesWithCommittees.length > 0 &&
          categoriesWithCommittees.map((data, index) => (
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
                {data.committees.length === 0 && (
                  <p className='w-full text-center'>No committees found</p>
                )}
                {data.committees.length > 0 &&
                  data.committees
                    .sort((a, b) =>
                      a.translations[0].title.localeCompare(
                        b.translations[0].title
                      )
                    )
                    .map((committee, index) => (
                      <Link
                        href={`./committees/${committee.translations[0].title.toLowerCase()}`}
                        title={committee.translations[0].title}
                        aria-label={committee.translations[0].title}
                        key={index}
                        className='min-w-[240px] w-fit relative rounded-t-lg border transition-transform hover:scale-110 hover:hover:font-bold bg-white'
                      >
                        <Image
                          src={committee.logo_url || Logo.src}
                          alt={`${committee.translations[0].title}icon`}
                          width={300}
                          height={300}
                          className='w-[100px] lg:w-[120px] h-auto absolute -top-8 left-0 right-0 bottom-0 m-auto'
                        />
                        <h3 className='uppercase w-[240px] text-xs lg:text-sm bg-[#232323] py-2 text-white absolute bottom-0 text-center px-2 tracking-wider'>
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
