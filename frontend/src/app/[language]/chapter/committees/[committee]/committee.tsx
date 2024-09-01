import { API_BASE_URL } from '@/utility/Constants'
import type Committee from '@/models/Committee'
import { redirect } from 'next/navigation'
import { GetCommitteePublic } from '@/api/committee'
import { fallbackLanguage } from '@/app/i18n/settings'
import Image from 'next/image'
import FallbackImage from 'public/images/logo.webp'
import CommitteeMembers from './members'
//import ExploreMore from './client/explore'
import ManageButton from './client/manage'
import Link from 'next/link'

export const revalidate = 60 * 60 * 24 * 30

interface Params {
  language: string
  committee: string
}

interface Props {
  params: Params
}

/**
 * @name generateStaticParams
 * @description Generates the static paths for the committee pages
 *
 * @returns {Promise<{ language: string; committee: string }[]>} The generated static paths
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-static-params | Next.js Static Generation}
 */
export async function generateStaticParams(): Promise<
  { language: string; committee: string }[]
> {
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
    return []
  }

  return []
}

/**
 * @name Committee
 * @description The page for displaying a committee
 *
 * @param {object} param - The dynamic URL parameters
 * @param {string} param.language - The language of the page
 * @param {string} param.committee - The committee name to display
 * @returns {Promise<JSX.Element>} The rendered server component
 */
export default async function Committee({
  params: { language, committee },
}: Props): Promise<JSX.Element> {
  const data: Committee | null = await GetCommitteePublic(committee, language)

  if (!data || Object.keys(data).length === 0) {
    redirect('/' + language + '/chapter/committees')
  }

  if (!data.translations) {
    redirect('/' + language + '/chapter/committees')
  }

  const committeeName = decodeURIComponent(committee)
  const hasGroupPhoto = !!data.group_photo_url

  return (
    <main>
      <section
        className={`${
          hasGroupPhoto ? 'min-h-[1080px] h-screen' : 'h-fit'
        } relative bg-[#EEE]`}
      >
        {hasGroupPhoto ? (
          <Image
            src={data.group_photo_url || ''}
            alt='img'
            fill
            className='object-cover'
          />
        ) : (
          <div className='w-full h-24 bg-black' />
        )}

        <div
          className={`w-full h-fit ${
            hasGroupPhoto
              ? 'absolute border-t-2 bg-black/75 text-white'
              : 'border-b-2 bg-[#EEE] dark:bg-[#222] mt-28 lg:mt-0'
          } backdrop-blur-xl bottom-0 left-0 px-12 py-12 flex items-center border-yellow-400`}
        >
          <div
            className='w-32 h-32 lg:w-52 lg:h-52 lg:mr-10 bg-white rounded-full absolute lg:relative overflow-hidden 
          mx-auto lg:ml-0 left-0 right-0 -top-24 lg:top-auto lg:left-auto lg:right-auto border-2 border-yellow-400'
          >
            <Image
              src={data.logo_url || FallbackImage.src}
              alt='img'
              width={208}
              height={208}
              className='w-24 lg:w-[9.5rem] bg-white h-auto absolute left-0 top-0 bottom-0 right-0 m-auto hover:scale-105 duration-300 transition-transform'
            />
          </div>
          <div className='w-full lg:w-fit h-fit flex flex-col justify-between items-center lg:items-start relative'>
            <h1
              className={`h-[144px] ${
                committeeName.length >= 15
                  ? 'text-lg xxs:text-xl md:text-4xl xl:text-6xl desktop:text-7xl'
                  : 'text-3xl xxs:text-4xl md:text-6xl xl:text-7xl'
              } uppercase tracking-wide w-fit text-center lg:text-start flex flex-col-reverse justify-center`}
            >
              {committeeName}
            </h1>
            <Link
              href={`mailto:${data.email}`}
              target='_blank'
              className='absolute top-0 text-lg underline-offset-4 dark:text-neutral-300 dark:hover:text-yellow-400 hover:text-yellow-400 hover:underline tracking-wide'
            >
              {data.email}
            </Link>
            <p className='max-w-[1000px] h-24 max-h-24 overflow-auto text-center xs:text-start'>
              {data.translations[0].description}
            </p>
          </div>
          <div
            className={`absolute right-4 sm:right-12 ${
              hasGroupPhoto ? '-top-20' : '-top-24 lg:bottom-8 lg:top-auto'
            }`}
          >
            <ManageButton language={language} committee={data} />
          </div>
        </div>
      </section>
      <CommitteeMembers language={language} committee={committee} />
      {/*<ExploreMore language={language} committee={committee} />*/}
    </main>
  )
}
