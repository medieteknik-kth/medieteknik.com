import { useTranslation } from '@/app/i18n'
import { HeadComponent } from '@/components/static/Static'
import StaticHeading from '@/components/static/StaticHeading'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import CookieSection from './cookie'
import { LanguageCode } from '@/models/Language'

interface Params {
  language: LanguageCode
}

interface Props {
  params: Promise<Params>
}

export default async function Privacy(props: Props) {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'legal')

  return (
    <main className='pb-4'>
      <HeadComponent title={t('title')} />
      <p className='text-center py-1 text-neutral-600 dark:text-neutral-300'>
        {t('lastUpdated')} <span className='font-bold'>2024-10-23</span>
      </p>
      <section id='policy' className='px-10 md:px-40 desktop:px-[475px]'>
        <StaticHeading
          title={t('privacyPolicy')}
          id='privacy'
          style={{
            fontSize: '1.875rem',
            lineHeight: '2.25rem',
            letterSpacing: '0.05em',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        />
        <p>
          {t('privacyPolicy.description')}
          <a
            href='https://medieteknik.com'
            target='_blank'
            className='hover:underline underline-offset-4 inline-block cursor-pointer transition-all text-blue-600 dark:text-primary'
          >
            https://medieteknik.com
          </a>
        </p>
        <br />
        <p>
          {t('privacyPolicy.other')}
          <a
            href='mailto:webmaster@medieteknik.com'
            target='_blank'
            className='hover:underline underline-offset-4 inline-block cursor-pointer transition-all text-blue-600 dark:text-primary'
          >
            webmaster@medieteknik.com
          </a>
        </p>
        <StaticHeading
          title={t('informationCollection')}
          id='collection'
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
        <Table className='w-[1000px]'>
          <TableCaption>{t('informationCollection')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='font-bold w-96'>
                {t('informationCollection.why')}
              </TableHead>
              <TableHead className='font-bold w-96'>
                {t('informationCollection.what')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{t('informationCollection.table.sso')}</TableCell>
              <TableCell>{t('informationCollection.table.sso_data')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                {t('informationCollection.table.personal')}
                <a
                  href='mailto:webmaster@medieteknik.com?subject=Data%20Deletion%20Request&body=Please%20delete%20my%20account%20and%20all%20associated%20data%20from%20medieteknik.com%0AMy%20email:%20%3Cyour%20email%20here%3E@kth.se'
                  target='_blank'
                  className='hover:underline underline-offset-4 inline-block cursor-pointer transition-all text-blue-600 dark:text-primary'
                >
                  webmaster@medieteknik.com
                </a>
                .
              </TableCell>
              <TableCell className='whitespace-pre-line'>
                {t('informationCollection.table.personal_data')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                {t('informationCollection.table.priviliged')}
              </TableCell>
              <TableCell className='whitespace-pre-line'>
                {t('informationCollection.table.priviliged_data')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                {t('informationCollection.table.committee')}
              </TableCell>
              <TableCell className='whitespace-pre-line'>
                {t('informationCollection.table.committee_data')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <StaticHeading
          title={t('rights')}
          id='rights'
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
        <ul className='list-disc mb-2'>
          <li>{t('rights.access')}</li>
          <li>
            {t('rights.deletion')}
            <br />
            <span className='text-sm text-red-500'>
              {t('rights.deletion.note')}
            </span>
          </li>
          <li>{t('rights.correction')}</li>
          <li>{t('rights.restriction')}</li>
          <li>{t('rights.processing')}</li>
          <li>{t('rights.transfer')}</li>
        </ul>
        {t('rights.proof')}
        <a
          href='mailto:webmaster@medieteknik.com'
          target='_blank'
          className='hover:underline underline-offset-4 inline-block cursor-pointer transition-all text-blue-600 dark:text-primary'
        >
          webmaster@medieteknik.com
        </a>
        <h2
          id='3rd-party'
          className='hidden text-xl pb-2 mb-2 pt-4 tracking-wide border-b-2 border-yellow-400'
        >
          3rd Party Data Processors
        </h2>
        <p className='hidden'>
          We use third-party services for the following purposes to process your
          data:
        </p>
        <br />
        <ul className='list-disc hidden'>
          <li>
            <p className='font-bold'>Google AdSense</p>
            <span>
              Our website uses Google AdSense, a service for including
              advertisements provided by Google. Google may use cookies or
              similar technologies to serve ads based on a user&apos;s prior
              visits to our website or other websites.
            </span>
            <br />
            <div className='flex gap-2 flex-wrap'>
              <Button variant={'default'} asChild>
                <Link
                  href='https://policies.google.com/privacy'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Google&apos;s Privacy Policy
                </Link>
              </Button>
              <Button variant={'secondary'} asChild>
                <Link
                  href='https://adssettings.google.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Google&apos;s Ad Settings
                </Link>
              </Button>

              <Button variant={'secondary'} asChild>
                <Link
                  href='https://policies.google.com/technologies/partner-sites'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Google&apos;s Partner Sites
                </Link>
              </Button>
            </div>
          </li>
        </ul>
      </section>
      <CookieSection language={language} />
    </main>
  )
}
