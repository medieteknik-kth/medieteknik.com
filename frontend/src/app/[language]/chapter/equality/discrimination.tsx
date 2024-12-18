import { useTranslation } from '@/app/i18n'
import StaticHeading from '@/components/static/StaticHeading'
import { LanguageCode } from '@/models/Language'

interface Props {
  language: LanguageCode
}

export default async function EqualityDiscrimination({ language }: Props) {
  const { t } = await useTranslation(language, 'equality/discrimination')

  return (
    <section className='md:min-w-[600px] w-full max-w-[700px] px-4 sm:px-12 md:px-0'>
      <StaticHeading
        title={t('title')}
        id='discrimination-harassment-and-norms'
        style={{
          fontSize: '1.875rem',
          lineHeight: '2.25rem',
          letterSpacing: '0.05em',
          paddingTop: '1rem',
          paddingBottom: '1rem',
        }}
      />
      <p>{t('description')}</p>
      <section>
        <StaticHeading
          title={t('direct_discrimination')}
          id='direct-discrimination'
          headingLevel='h3'
          style={{
            width: '100%',
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            letterSpacing: '0.025em',
            paddingTop: '1rem',
            paddingBottom: '0.5rem',
            marginBottom: '0.5rem',
            borderBottomWidth: '2px',
            borderColor: 'rgb(250 204 21)',
          }}
        />
        <p>{t('direct_discrimination.description')}</p>
        <br />
        <div>
          <p>{t('direct_discrimination.examples')}</p>
          <ul className='list-disc px-6 sm:px-12'>
            <li>{t('direct_discrimination.example_1')}</li>
            <li>{t('direct_discrimination.example_2')}</li>
          </ul>
        </div>
      </section>
      <section>
        <StaticHeading
          title={t('indirect_discrimination')}
          id='indirect-discrimination'
          headingLevel='h3'
          style={{
            width: '100%',
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            letterSpacing: '0.025em',
            paddingTop: '1rem',
            paddingBottom: '0.5rem',
            marginBottom: '0.5rem',
            borderBottomWidth: '2px',
            borderColor: 'rgb(250 204 21)',
          }}
        />
        <p>{t('indirect_discrimination.description')}</p>
        <br />
        <div>
          <p>{t('indirect_discrimination.examples')}</p>
          <ul className='list-disc px-6 sm:px-12'>
            <li>{t('indirect_discrimination.example_1')}</li>
            <li>{t('indirect_discrimination.example_2')}</li>
          </ul>
        </div>
      </section>
      <section>
        <StaticHeading
          title={t('harassment')}
          id='harassment'
          headingLevel='h3'
          style={{
            width: '100%',
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            letterSpacing: '0.025em',
            paddingTop: '1rem',
            paddingBottom: '0.5rem',
            marginBottom: '0.5rem',
            borderBottomWidth: '2px',
            borderColor: 'rgb(250 204 21)',
          }}
        />
        <p>{t('harassment.description')}</p>
        <br />
        <div>
          <p>{t('harassment.examples')}</p>
          <ul className='list-disc px-6 sm:px-12'>
            <li>{t('harassment.example_1')}</li>
            <li>{t('harassment.example_2')}</li>
          </ul>
        </div>
      </section>
      <section>
        <StaticHeading
          title={t('sexual_harassment')}
          id='sexual-harassment'
          headingLevel='h3'
          style={{
            width: '100%',
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            letterSpacing: '0.025em',
            paddingTop: '1rem',
            paddingBottom: '0.5rem',
            marginBottom: '0.5rem',
            borderBottomWidth: '2px',
            borderColor: 'rgb(250 204 21)',
          }}
        />
        <p>{t('sexual_harassment.description')}</p>
        <br />
        <div>
          <p>{t('sexual_harassment.examples')}</p>
          <ul className='list-disc px-6 sm:px-12'>
            <li>{t('sexual_harassment.example_1')}</li>
            <li>{t('sexual_harassment.example_2')}</li>
          </ul>
        </div>
      </section>
      <section>
        <StaticHeading
          title={t('norms')}
          id='norms'
          headingLevel='h3'
          style={{
            width: '100%',
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            letterSpacing: '0.025em',
            paddingTop: '1rem',
            paddingBottom: '0.5rem',
            marginBottom: '0.5rem',
            borderBottomWidth: '2px',
            borderColor: 'rgb(250 204 21)',
          }}
        />
        <p>{t('norms.description')}</p>
        <br />
        <div>
          <p>{t('norms.examples')}</p>
          <ul className='list-disc px-6 sm:px-12'>
            <li>{t('norms.example_1')}</li>
            <li>{t('norms.example_2')}</li>
          </ul>
        </div>
        <br />
        <p>{t('norm_critique')}</p>
      </section>
    </section>
  )
}
