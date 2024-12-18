import { useTranslation } from '@/app/i18n'
import StaticHeading from '@/components/static/StaticHeading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { LanguageCode } from '@/models/Language'

interface Props {
  language: LanguageCode
}

export default async function EqualityConcepts({ language }: Props) {
  const { t } = await useTranslation(language, 'equality/concepts')

  return (
    <section className='md:min-w-[600px] w-full max-w-[700px] px-4 sm:px-12 md:px-0'>
      <StaticHeading
        title={t('title')}
        id='concept-list'
        style={{
          fontSize: '1.875rem',
          lineHeight: '2.25rem',
          letterSpacing: '0.05em',
          paddingTop: '1rem',
          paddingBottom: '1rem',
        }}
      />
      <Accordion type='multiple'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>{t('equality')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('equality.description')}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>{t('diversity')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('diversity.description')}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>{t('inclusivity')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('inclusivity.description')}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-4'>
          <AccordionTrigger>{t('ths_policy')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('ths_policy.description')}</p>
            <br />
            <a
              href='https://drive.google.com/drive/u/0/folders/1Yg90ggSuvpP_9858ByotplhSgR01l6aX'
              target='_blank'
              className='hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary'
            >
              {t('ths_policy')}
            </a>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-5'>
          <AccordionTrigger>{t('media_conduct')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('media_conduct.description')}</p>
            <br />
            <a
              href={t('media_conduct.url')}
              target='_blank'
              className='hover:underline underline-offset-4 cursor-pointer transition-all text-blue-600 dark:text-primary'
            >
              {t('media_conduct')}
            </a>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-6'>
          <AccordionTrigger>{t('discrimination')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('discrimination.description')}</p>
            <br />
            <p>{t('discrimination.examples')}</p>
            <ul className='list-disc px-10'>
              <li>{t('discrimination.example_1')}</li>
              <li>{t('discrimination.example_2')}</li>
              <li>{t('discrimination.example_3')}</li>
              <li>{t('discrimination.example_4')}</li>
              <li>{t('discrimination.example_5')}</li>
              <li>{t('discrimination.example_6')}</li>
              <li>{t('discrimination.example_7')}</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-7'>
          <AccordionTrigger>{t('harassment')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('harassment.description')}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-8'>
          <AccordionTrigger>{t('sexual_harassment')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('sexual_harassment.description')}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-9'>
          <AccordionTrigger>{t('norms')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('norms.description')}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-10'>
          <AccordionTrigger>{t('norm_critique')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('norm_critique.description')}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-11'>
          <AccordionTrigger>{t('gender_identity')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('gender_identity.description')}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-12'>
          <AccordionTrigger>{t('sexual_identity')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('sexual_identity.description')}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-13'>
          <AccordionTrigger>{t('privileges')}</AccordionTrigger>
          <AccordionContent>
            <p>{t('privileges.description')}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
