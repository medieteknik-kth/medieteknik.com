import { GetCommitteeMembers } from '@/api/committee'
import EqualityConcepts from '@/app/[language]/chapter/equality/concepts'
import EqualityDiscrimination from '@/app/[language]/chapter/equality/discrimination'
import EqualityPlans from '@/app/[language]/chapter/equality/plans'
import { useTranslation } from '@/app/i18n'
import StudentCommitteCard from '@/components/cards/StudentCard'
import HeaderGap from '@/components/header/components/HeaderGap'
import { HeadComponent } from '@/components/static/Static'
import StaticHeading from '@/components/static/StaticHeading'

interface Params {
  language: string
}

interface Props {
  params: Promise<Params>
}

export default async function Equality(props: Props) {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'equality/equality')
  const members = await GetCommitteeMembers('studienämnden', 'sv', 1)

  if (!members) {
    return null
  }

  const filteredMembers = members.items.filter(
    (member) => member.position.email !== 'pas@medieteknik.com'
  )

  return (
    <main className='pb-4 w-full grid place-items-center'>
      <HeaderGap />
      <HeadComponent title={t('title')} />
      <section className='md:min-w-[600px] w-full max-w-[700px] px-4 sm:px-12 md:px-0'>
        <StaticHeading
          title={t('dei')}
          id='dei'
          style={{
            fontSize: '1.875rem',
            lineHeight: '2.25rem',
            letterSpacing: '0.05em',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        />
        <p>
          {t('dei.description')}
          <br />
          {t('dei.contact')}
          <a
            href='mailto:jamo@medieteknik.com'
            className='hover:underline underline-offset-4 inline-block cursor-pointer transition-all text-blue-600 dark:text-primary'
          >
            jamo@medieteknik.com
          </a>
        </p>
      </section>
      <section className='md:min-w-[600px] w-full max-w-[700px] px-4 sm:px-12 md:px-0'>
        <StaticHeading
          title={t('safety_council')}
          id='safety-council'
          style={{
            fontSize: '1.875rem',
            lineHeight: '2.25rem',
            letterSpacing: '0.05em',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        />
        <p>{t('safety_council.description')}</p>
        <br />
        <p>{t('safety_council.contact')}</p>
        <a
          href='https://docs.google.com/forms/d/e/1FAIpQLScjjMkYBuJ3s1TwQjHI7VYhyFIrlafQtmA1X2ile6VFUBmF9w/viewform?usp=sf_link'
          target='_blank'
          className='hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary'
        >
          {t('safety_council.contact.file')}
        </a>
        <br />
        <br />
        <div>
          <h3 className='text-center text-xl tracking-wide uppercase py-0.5'>
            {t('safety_council')}
          </h3>
          <ul className='flex flex-wrap gap-8 justify-center py-1'>
            {filteredMembers
              .sort((a, b) => a.position.weight - b.position.weight)
              .map((member, index) => (
                <StudentCommitteCard
                  key={index}
                  member={member}
                  committeeLogo={false}
                />
              ))}
          </ul>
        </div>
      </section>
      <EqualityConcepts language={language} />
      <EqualityDiscrimination language={language} />
      <EqualityPlans language={language} />
    </main>
  )
}
