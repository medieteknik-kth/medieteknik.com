import {
  getCommitteeCategories,
  getCommitteesForCategory,
} from '@/api/committee_category'
import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import { HeadComponent } from '@/components/static/Static'
import Committee, { CommitteeCategory } from '@/models/Committee'
import Image from 'next/image'
import Link from 'next/link'
import Logo from 'public/images/logo.webp'

interface CommitteeCategoryWithCommittees extends CommitteeCategory {
  committees: Committee[]
}

interface Params {
  language: string
}

interface Props {
  params: Promise<Params>
}

export default async function CommitteeList(props: Props) {
  const { language } = await props.params
  const { data: committeeCategories } = await getCommitteeCategories(language)
  const categoriesWithCommittees: CommitteeCategoryWithCommittees[] = []
  const { t } = await useTranslation(language, 'committee')

  if (!committeeCategories) {
    return (
      <main>
        <HeaderGap />
        <HeadComponent title='Committees' />
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
    const { data: committees } = await getCommitteesForCategory(
      committeeCategory.translations[0].title,
      language
    )
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
      <HeaderGap />
      <HeadComponent title={t('title')} />

      <div className='w-fit flex flex-col gap-10 py-10 sm:px-16 xl:px-52 desktop:px-96 dark:bg-[#111]'>
        {categoriesWithCommittees.length === 0 && (
          <div className='w-full h-full flex justify-center items-center'>
            <h2 className='text-2xl lg:text-4xl'>{t('not_found')}</h2>
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
                  <p className='w-full text-center'>{t('not_found')}</p>
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
