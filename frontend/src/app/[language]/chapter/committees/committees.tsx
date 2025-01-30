import {
  getCommitteeCategories,
  getCommitteesForCategory,
} from '@/api/committee_category'
import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type Committee from '@/models/Committee'
import type { CommitteeCategory } from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'

interface CommitteeCategoryWithCommittees extends CommitteeCategory {
  committees: Committee[]
}

interface Params {
  language: LanguageCode
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

  if (categoriesWithCommittees.length === 0) {
    return (
      <main>
        <HeadComponent title='Committees' />
        <h2 className='text-center text-2xl my-8'>{t('not_found')}</h2>
        <p className='text-center my-4'>
          Contact{' '}
          <a
            href='mailto:webmaster@medieteknik.com'
            className='hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary'
          >
            webmaster@medieteknik.com
          </a>
        </p>
      </main>
    )
  }

  return (
    <main>
      <HeadComponent title={t('title')} />

      <div className='w-full flex flex-col gap-10 py-10 px-2 sm:px-5 md:px-12 xl:px-52 desktop:px-96 dark:bg-[#111]'>
        <Accordion
          type='multiple'
          className='w-full flex flex-col gap-4'
          defaultValue={categoriesWithCommittees.map((category) =>
            category.translations[0].title.toLowerCase()
          )}
        >
          {categoriesWithCommittees.length > 0 &&
            categoriesWithCommittees.map((category) => (
              <AccordionItem
                value={category.translations[0].title.toLowerCase()}
                key={category.translations[0].title}
                id={`${category.translations[0].title.toLowerCase()}`}
                className='w-full h-fit flex flex-col'
              >
                <AccordionTrigger className='text-2xl lg:text-4xl w-full text-center font-semibold sm:text-left uppercase tracking-wider'>
                  <h2>{category.translations[0].title}</h2>
                </AccordionTrigger>
                <AccordionContent className='p-4 pb-16 sm:pb-4 flex justify-center sm:justify-start flex-wrap gap-y-12 gap-x-4 sm:gap-4'>
                  {category.committees.length === 0 && (
                    <p className='w-full text-center'>{t('not_found')}</p>
                  )}
                  {category.committees.length > 0 &&
                    category.committees
                      .sort((a, b) =>
                        a.translations[0].title.localeCompare(
                          b.translations[0].title
                        )
                      )
                      .map((committee) => (
                        <Link
                          href={`./committees/${committee.translations[0].title.toLowerCase()}`}
                          title={committee.translations[0].title}
                          key={committee.translations[0].title}
                          className='w-28 sm:w-56 h-auto aspect-square relative rounded-full border border-yellow-400 shadow shadow-black/20 transition-transform motion-reduce:hover:scale-100 hover:scale-110 hover:hover:font-bold bg-white grid place-items-center'
                        >
                          <Image
                            src={committee.logo_url || Logo.src}
                            alt={`${committee.translations[0].title} logo`}
                            width={300}
                            height={300}
                            loading='lazy'
                            className='w-16 sm:w-28 lg:w-32 h-auto absolute top-0 sm:-top-6 bottom-0 my-auto'
                          />
                          <h3 className='uppercase w-[130px] text-xs absolute -bottom-10 sm:bottom-6 text-center tracking-wider text-black'>
                            {committee.translations[0].title.length > 15
                              ? committee.translations[0].title.replace(
                                  /(grupp|nämnden)/g,
                                  '- $1'
                                )
                              : committee.translations[0].title}
                          </h3>
                        </Link>
                      ))}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </main>
  )
}
