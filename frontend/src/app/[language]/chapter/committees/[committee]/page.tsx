import { API_BASE_URL } from '@/utility/Constants'
import type Committee from '@/models/Committee'
import { redirect } from 'next/navigation'
import { GetCommitteePublic } from '@/api/committee'
import { fallbackLanguage } from '@/app/i18n/settings'
import Image from 'next/image'
import FallbackImage from 'public/images/logo.png'
import CommitteeMembers from './members'
import { Button } from '@/components/ui/button'
import ExploreMore from './explore'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export const revalidate = 60 * 60 * 24 * 30

export async function generateStaticParams() {
  try {
    const response = await fetch(
      API_BASE_URL + `/public/committees?language=${fallbackLanguage}`
    )

    if (response.ok) {
      const data = (await response.json()) as Committee[]

      return data.map((committee: Committee) => ({
        language: '[language]',
        committee: encodeURIComponent(
          committee.translations[0].title.toLowerCase()
        ),
      }))
    }
  } catch (error) {
    console.error(error)
  }
}

export default async function Committee({
  params: { language, committee },
}: {
  params: { language: string; committee: string }
}) {
  const data: Committee | null = await GetCommitteePublic(committee, language)

  if (!data || Object.keys(data).length === 0) {
    redirect('/' + language + '/chapter/committees')
  }

  if (!data.translations) {
    redirect('/' + language + '/chapter/committees')
  }

  const committeeName = decodeURIComponent(committee)

  return (
    <main>
      <section className='min-h-[1080px] h-screen relative'>
        <Image
          src={
            'https://storage.googleapis.com/medieteknik-static/images/styrelsen23_24.jpg'
          }
          alt='img'
          objectFit='cover'
          fill
          className='-z-10 overflow-scroll absolute left-0 top-0 bottom-0 right-0 m-auto'
        />

        <div className='w-full h-fit bg-black/75 absolute backdrop-blur-xl bottom-0 left-0 px-12 py-12 flex items-center border-t-2 border-yellow-400'>
          <div
            className='w-32 h-32 lg:w-52 lg:h-52 lg:mr-10 bg-white rounded-full absolute lg:relative overflow-hidden 
          mx-auto lg:ml-0 left-0 right-0 -top-24 lg:top-auto lg:left-auto lg:right-auto border-2 border-yellow-400'
          >
            <Image
              src={data.logo_url || FallbackImage.src}
              alt='img'
              width={208}
              height={208}
              className='w-24 lg:w-[9.5rem] h-auto absolute left-0 top-0 bottom-0 right-0 m-auto hover:scale-105 duration-300 transition-transform'
            />
          </div>
          <div className='w-full lg:w-fit h-fit flex flex-col text-white justify-between items-center lg:items-start'>
            <h1 className='h-[144px] text-4xl xs:text-6xl sm:text-7xl uppercase tracking-wide max-w-[550px] text-center lg:text-start'>
              {committeeName}
            </h1>
            <p className='max-w-[1000px] h-24 max-h-24 overflow-hidden'>
              {data.translations[0].description}
            </p>
          </div>
          <div className='w-12 h-12 absolute right-4 sm:right-12 -top-16'>
            <Button size={'icon'} className='w-full h-full' asChild>
              <Link
                href={`/${language}/chapter/committees/${committee}/manage`}
              >
                <Cog8ToothIcon className='w-8 h-8' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <CommitteeMembers language={language} committee={committee} />
      <ExploreMore language={language} committee={committee} />
    </main>
  )
}
