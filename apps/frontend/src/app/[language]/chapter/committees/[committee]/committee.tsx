//import ExploreMore from './client/explore'
import HeaderGap from '@/components/header/components/HeaderGap'
import type Committee from '@/models/Committee'
import { API_BASE_URL } from '@/utility/Constants'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import ManageButton from './client/manage'
import CommitteeMembers from './members'

import { getPublicCommitteeData } from '@/api/committee'
import type { LanguageCode } from '@/models/Language'
import type { JSX } from 'react'

interface Params {
  language: LanguageCode
  committee: string
}

interface Props {
  params: Promise<Params>
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
      `${API_BASE_URL}/public/committees?language=sv`,
      {
        next: {
          revalidate: 2_592_000, // 3 months
        },
      }
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
 * @name CommitteePage
 * @description The page for displaying a committee
 *
 * @param {object} param - The dynamic URL parameters
 * @param {string} param.language - The language of the page
 * @param {string} param.committee - The committee name to display
 * @returns {Promise<JSX.Element>} The rendered server component
 */
export default async function CommitteePage(
  props: Props
): Promise<JSX.Element> {
  const { language, committee } = await props.params
  const { data: committeeData, error } = await getPublicCommitteeData(
    committee,
    language
  )

  if (error) {
    console.error(error)
    redirect(`/${language}/chapter/committees`)
  }

  if (Object.keys(committeeData).length === 0) {
    redirect(`/${language}/chapter/committees`)
  }

  if (!committeeData.translations || committeeData.hidden) {
    redirect(`/${language}/chapter/committees`)
  }

  const committeeName = decodeURIComponent(committee)

  return (
    <main>
      <section
        className={`${
          committeeData.group_photo_url
            ? 'desktop:min-h-[1080px] h-[70vh] lg:h-[80vh] xl:h-[90vh]'
            : 'h-fit'
        } relative bg-[#EEE] dark:bg-[#222]`}
      >
        {committeeData.group_photo_url ? (
          <Image
            src={committeeData.group_photo_url}
            alt='img'
            className='object-cover h-full'
            quality={80}
            fill
            priority
            loading='eager'
          />
        ) : (
          <HeaderGap />
        )}

        <div
          className={`w-full ${
            committeeData.group_photo_url
              ? 'absolute h-fit bottom-0 border-t-2 text-white'
              : 'h-full border-b-2 mt-32 lg:mt-0 relative'
          } px-12 py-12 flex flex-col lg:flex-row gap-4 lg:gap-10 items-center border-yellow-400`}
        >
          {committeeData.group_photo_url && (
            <>
              <svg xmlns='http://www.w3.org/2000/svg' className='hidden'>
                <title>Blur Effect</title>
                <filter id='blur' x='0' y='0' width='100%' height='100%'>
                  <feGaussianBlur stdDeviation='5' />
                </filter>
              </svg>
              <div
                className='w-full absolute left-0 bg-black/75 top-0 bottom-0'
                style={{ filter: 'url(#blur)' }}
              />
            </>
          )}
          <div className='w-32 h-auto lg:w-52 -top-24 left-0 right-0 mx-auto lg:mx-0 absolute lg:static grid aspect-square bg-white rounded-full overflow-hidden border-2 border-yellow-400  place-items-center z-10'>
            <Image
              src={committeeData.logo_url}
              alt='img'
              unoptimized={true} // Logos are SVGs, so they don't need to be optimized
              width={208}
              height={208}
              className='w-full bg-white h-auto hover:scale-105 duration-300 transition-transform p-5 lg:p-8 object-cover'
            />
          </div>
          <div className='w-fit h-fit flex flex-col justify-between items-center lg:items-start relative'>
            <h1
              className={`h-fit pt-8 pb-4 font-semibold ${
                committeeName.length >= 15
                  ? 'text-lg xxs:text-xl md:text-4xl xl:text-6xl desktop:text-7xl'
                  : 'text-3xl xxs:text-4xl md:text-6xl xl:text-7xl'
              } uppercase tracking-wide w-fit text-center lg:text-start flex flex-col-reverse justify-center`}
            >
              {committeeName}
            </h1>
            <Link
              href={`mailto:${committeeData.email}`}
              target='_blank'
              className={`absolute top-0 text-lg underline-offset-4 hover:underline tracking-wide ${
                committeeData.group_photo_url
                  ? 'text-yellow-400'
                  : 'text-blue-600 dark:text-primary'
              }`}
            >
              {committeeData.email}
            </Link>
            <p className='max-w-[1000px] h-24 max-h-24 overflow-auto text-center xs:text-start'>
              {committeeData.translations[0].description}
            </p>
          </div>
          <div
            className={`absolute right-4 sm:right-12 ${
              committeeData.group_photo_url
                ? '-top-20'
                : '-top-24 lg:bottom-8 lg:top-auto'
            }`}
          >
            <ManageButton language={language} committee={committeeData} />
          </div>
        </div>
      </section>
      <CommitteeMembers language={language} committee={committee} />
    </main>
  )
}
