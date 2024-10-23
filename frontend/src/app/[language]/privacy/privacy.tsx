import { useTranslation } from '@/app/i18n'
import HeaderGap from '@/components/header/components/HeaderGap'
import { HeadComponent } from '@/components/static/Static'
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

interface Params {
  language: string
}

interface Props {
  params: Promise<Params>
}

export default async function Privacy(props: Props) {
  const { language } = await props.params
  const { t } = await useTranslation(language, 'legal')

  return (
    <main className='pb-4'>
      <HeaderGap />
      <HeadComponent title={t('title')} />
      <p className='text-center py-1 text-neutral-600 dark:text-neutral-300'>
        {t('lastUpdated')} <span className='font-bold'>2024-10-23</span>
      </p>
      <section id='policy' className='px-10 md:px-40 desktop:px-[500px]'>
        <h1 className='text-3xl tracking-wider py-4'>{t('privacyPolicy')}</h1>
        <p>
          {t('privacyPolicy.description')}
          <a
            href='https://medieteknik.com'
            target='_blank'
            className='text-sky-800 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-500 transition-colors'
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
            className='text-sky-800 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-500 transition-colors'
          >
            webmaster@medieteknik.com
          </a>
        </p>
        <h2
          id='collection'
          className='text-xl pb-2 mb-2 pt-4 tracking-wide border-b-2 border-yellow-400'
        >
          {t('informationCollection')}
        </h2>
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
                  className='text-sky-800 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-500 transition-colors'
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
        <h2
          id='rights'
          className='text-xl pb-2 mb-2 pt-4 tracking-wide border-b-2 border-yellow-400'
        >
          {t('rights')}
        </h2>
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
          className='text-sky-800 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-500 transition-colors'
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
              similar technologies to serve ads based on a user's prior visits
              to our website or other websites.
            </span>
            <br />
            <div className='flex gap-2 flex-wrap'>
              <Button variant={'default'} asChild>
                <Link
                  href='https://policies.google.com/privacy'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Google's Privacy Policy
                </Link>
              </Button>
              <Button variant={'secondary'} asChild>
                <Link
                  href='https://adssettings.google.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Google's Ad Settings
                </Link>
              </Button>

              <Button variant={'secondary'} asChild>
                <Link
                  href='https://policies.google.com/technologies/partner-sites'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Google's Partner Sites
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
