import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { fontJetBrainsMono } from '@/app/fonts'

export default function CookieSection() {
  return (
    <section id='cookies' className='px-10 md:px-40 desktop:px-[500px]'>
      <h1 className='text-3xl tracking-wider py-4'>Cookies</h1>
      <p>
        We use "cookies" to collect information about you and your activity
        across our site. A cookie is a small piece of data that our website
        stores on your computer, and accesses each time you visit, so we can
        understand how you use our site. This helps us serve you content based
        on preferences you have specified.
      </p>
      <h2
        id='necessary'
        className='text-xl pb-2 mb-2 pt-4 tracking-wide border-b-2 border-yellow-400'
      >
        Necessary Cookies
      </h2>
      <p>
        We use some cookies that are required for the site to function properly.
        These necessary cookies are required to use the site and provide a
        better experience.
      </p>
      <Accordion type='single' collapsible>
        <AccordionItem value='necessary'>
          <AccordionTrigger>
            <p className=''>
              List of 1st Party Necessary Cookies{' '}
              <ChevronUpDownIcon className='h-6 w-6 inline' />
            </p>
          </AccordionTrigger>
          <AccordionContent>
            <Table className='w-[1000px]'>
              <TableCaption>Necessary Cookies</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-bold w-96'>Cookie Name</TableHead>
                  <TableHead className='font-bold w-96'>Purpose</TableHead>
                  <TableHead className='font-bold w-32'>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <code className={`${fontJetBrainsMono.className}`}>
                      session
                    </code>
                  </TableCell>
                  <TableCell>
                    This cookie is used to identify your session on the site. It
                    includes your session ID and is used to maintain your login
                    state.
                  </TableCell>
                  <TableCell>session</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
      </Accordion>
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
