import { Head } from '@/components/static/Static'

import Logo from 'public/images/logo.png'

import Image from 'next/image'
import Link from 'next/link'

type CommitteeCategoryProps = {
  committee_category_id: number
  title: string
}

type CommitteeProps = {
  committee_id: number
  committee_category_id: number
  description: string
  email: string
  logo_url: string
  title: string
}

async function getCommitteeCategoryData(
  language: string
): Promise<CommitteeCategoryProps[]> {
  const res = await fetch(
    `http://localhost:8000/api/v1/committee_categories?language_code=${language}`
  )
  const data = await res.json()
  return data
}

async function getCommitteeData(language: string): Promise<CommitteeProps[]> {
  const res = await fetch(
    `http://localhost:8000/api/v1/committees?language_code=${language}`
  )
  const data = await res.json()
  return data
}

export default async function Committees({
  params: { language },
}: {
  params: { language: string }
}) {
  const committeeCategoryData = await getCommitteeCategoryData(language)
  const committeeData = await getCommitteeData(language)

  return (
    <main className='w-screen'>
      <div className='h-24 bg-black' />
      <Head title='Committees' />

      <div className='w-full flex flex-col items-center py-20'>
        {committeeCategoryData.map((category, index) => (
          <section key={index} className='w-1/2 h-fit flex flex-col mb-20'>
            <h2 className='text-4xl uppercase tracking-wider border-b-2 border-yellow-400 pb-4'>
              {category.title}
            </h2>
            <div className='w-full h-fit *:h-[200px] grid grid-cols-5 gap-8 my-4'>
              {committeeData
                .filter(
                  (committee) =>
                    committee.committee_category_id ===
                    category.committee_category_id
                )
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((item, index) => (
                  <Link
                    href={`./committees/${item.title.toLowerCase()}`}
                    title={item.title}
                    aria-label={item.title}
                    key={index}
                    className='relative shadow-lg shadow-yellow-400/50 transition-transform hover:scale-110 hover:hover:font-bold'
                  >
                    <Image
                      src={item.logo_url || Logo.src}
                      alt={`${item.title}icon`}
                      width={100}
                      height={100}
                      className='w-[100px] h-[100px] absolute top-0 left-0 right-0 bottom-0 m-auto'
                    />
                    <h3 className='uppercase text-sm bg-[#232323] py-2 text-white absolute bottom-0 w-full text-center'>
                      {item.title}
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
