import { fontJetBrainsMono } from '@/app/fonts'
import { useTranslation } from '@/app/i18n'
import StaticHeading from '@/components/static/StaticHeading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Props {
  language: string
}

export default async function CookieSection({ language }: Props) {
  const { t } = await useTranslation(language, 'legal')
  return (
    <section id='cookies' className='px-10 md:px-40 desktop:px-[475px]'>
      <StaticHeading
        title={t('cookies')}
        id='cookies'
        style={{
          fontSize: '1.875rem',
          lineHeight: '2.25rem',
          letterSpacing: '0.05em',
          paddingTop: '1rem',
          paddingBottom: '1rem',
        }}
      />
      <p>{t('cookies.description')}</p>
      <StaticHeading
        title={t('cookies.necessary')}
        id='necessary'
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
      <p>{t('cookies.necessary.description')}</p>
      <Accordion type='single' collapsible>
        <AccordionItem value='necessary'>
          <AccordionTrigger>{t('cookies.necessary.list')}</AccordionTrigger>
          <AccordionContent>
            <Table className='w-[1000px]'>
              <TableCaption>{t('cookies.necessary')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-bold w-96'>
                    {t('cookies.table.name')}
                  </TableHead>
                  <TableHead className='font-bold w-96'>
                    {t('cookies.table.purpose')}
                  </TableHead>
                  <TableHead className='font-bold w-32'>
                    {t('cookies.table.duration')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <code className={`${fontJetBrainsMono.className}`}>
                      session
                    </code>
                  </TableCell>
                  <TableCell>{t('cookies.necessary.list.session')}</TableCell>
                  <TableCell>session</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className={`${fontJetBrainsMono.className}`}>
                      access_token_cookie
                    </code>
                  </TableCell>
                  <TableCell>
                    {t('cookies.necessary.list.access_token')}
                  </TableCell>
                  <TableCell>1h</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className={`${fontJetBrainsMono.className}`}>
                      refresh_token_cookie
                    </code>
                  </TableCell>
                  <TableCell>
                    {t('cookies.necessary.list.refresh_token')}
                  </TableCell>
                  <TableCell>30d</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* 
      <h2
        id='functional'
        className='text-xl pb-2 mb-2 pt-4 tracking-wide border-b-2 border-yellow-400'
      >
        Functional Cookies
      </h2>
      <p>
        We use some cookies to provide functionality on the site. These
        functional cookies are used to enhance the user experience by
        remembering your preferences.
      </p>
      <Accordion type='single' collapsible>
        <AccordionItem value='necessary'>
          <AccordionTrigger>
            <p className=''>
              List of 1st Party Functional Cookies{' '}
              <ChevronUpDownIcon className='h-6 w-6 inline' />
            </p>
          </AccordionTrigger>
          <AccordionContent>
            <Table className='w-[1000px]'>
              <TableCaption>Functional Cookies</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-bold w-40'>Cookie Name</TableHead>
                  <TableHead className='font-bold w-96'>Purpose</TableHead>
                  <TableHead className='font-bold w-32'>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <code className={`${fontJetBrainsMono.className}`}>
                      language
                    </code>
                  </TableCell>
                  <TableCell>
                    This cookie is used to remember your language preference on
                    the site. It will automatically redirect you to the correct
                    language based on your preference.
                  </TableCell>
                  <TableCell>session</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <code className={`${fontJetBrainsMono.className}`}>
                      theme
                    </code>
                  </TableCell>
                  <TableCell>
                    This cookie is used to remember your theme preference on the
                    site. Will be stored in local storage if you have not
                    accepted functional cookies.
                  </TableCell>
                  <TableCell>1 year</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>*/}
      {/*
        TODO: When the following cookies are implemented, uncomment this section
        <h2 className='text-xl py-2 tracking-wide font-bold'>
          Performance Cookies
        </h2>
        <p>
          We use some cookies to measure and analyze the performance of our
          site. These performance cookies are used to understand how you use the
          site and to improve the site. All user data is aggregated and can not
          be used to identify individuals.
        </p>
        <h2 className='text-xl py-2 tracking-wide font-bold'>
          Analytical Cookies
        </h2>
        <p>
          We use some cookies to analyze how you use our site. These analytical
          cookies are used to understand what content is popular and how
          visitors are using the site to help us improve the user experience.
        </p>
        <h2 className='text-xl py-2 tracking-wide font-bold'>
          Advertising Cookies
        </h2>
        <p>
          We use some cookies to personalize the ads you see on our site. These
          advertising cookies are used to show you relevant ads based on your
          preferences.
        </p>*/}
    </section>
  )
}
