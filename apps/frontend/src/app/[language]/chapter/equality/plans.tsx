import { useTranslation } from '@/app/i18n'
import StaticHeading from '@/components/static/StaticHeading'
import type { LanguageCode } from '@/models/Language'

interface Props {
  language: LanguageCode
}

export default async function EqualityPlans({ language }: Props) {
  const { t } = await useTranslation(language, 'equality/plans')

  return (
    <section className='md:min-w-[600px] w-full max-w-[700px] px-4 sm:px-12 md:px-0'>
      <StaticHeading
        title={t('title')}
        id='plan-inclusive-section-events'
        style={{
          fontSize: '1.875rem',
          lineHeight: '2.25rem',
          letterSpacing: '0.05em',
          paddingTop: '1rem',
          paddingBottom: '1rem',
        }}
      />
      <p>{t('description')}</p>
      <ul className='list-disc px-6 sm:px-12'>
        <li>{t('tip_1')}</li>
        <li>{t('tip_2')}</li>
        <li>{t('tip_3')}</li>
        <li>{t('tip_4')}</li>
      </ul>
    </section>
  )
}
