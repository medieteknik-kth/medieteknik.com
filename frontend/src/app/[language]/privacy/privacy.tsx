import { Head } from '@/components/static/Static'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CookieSection from './cookie'

export default function Privacy() {
  return (
    <main className='pb-4'>
      <div className='h-24 bg-black' />
      <Head title='Legal' />
      <section id='policy' className='px-10 md:px-40 desktop:px-[500px]'>
        <h1 className='text-3xl tracking-wider py-4'>Privacy Policy</h1>
        <p>
          Your privacy is important to us. It is our policy to respect your
          privacy regarding any information we may collect from you across our
          website{' '}
          <a
            href='https://medieteknik.com'
            target='_blank'
            className='text-sky-800'
          >
            https://medieteknik.com
          </a>
        </p>
        <br />
        <p>
          For any other issue or concern not addressed in this policy, please do
          not hesitate to contact us at{' '}
          <a
            href='mailto:webmaster@medieteknik.com'
            target='_blank'
            className='text-sky-800'
          >
            webmaster@medieteknik.com
          </a>
        </p>
        <h2
          id='collection'
          className='text-xl pb-2 mb-2 pt-4 tracking-wide border-b-2 border-yellow-400'
        >
          Information we collect
        </h2>
        <Table className='w-[1000px]'>
          <TableCaption>Information we collect</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='font-bold w-96'>
                Why and How we process data
              </TableHead>
              <TableHead className='font-bold w-96'>
                What data is processed
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                We obtain your data when you sign up for an account on our site
                using KTH SSO (Single Sign-On), for the purpose of user
                identification and authentication.
              </TableCell>
              <TableCell>
                KTH unique user ID and subsequent email assoicated with the ID
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                At will, you are able to provide us with additional information
                about yourself. This information is optional and can be changed
                or deleted at any time by request to{' '}
                <a
                  href='mailto:webmaster@medieteknik.com?subject=Data%20Deletion%20Request&body=Please%20delete%20my%20account%20and%20all%20associated%20data%20from%20medieteknik.com%0AMy%20email:%20%3Cyour%20email%20here%3E@kth.se'
                  target='_blank'
                  className='text-sky-800'
                >
                  webmaster@medieteknik.com
                </a>
                .
              </TableCell>
              <TableCell>
                First Name and Last Name
                <br />
                Profile Picture
                <br />
                Social Media Links
                <br />
                Passwords (hashed and salted)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Priviliged users are able to upload documents, create news
                posts, and host events. This information is stored for
                historical records.
              </TableCell>
              <TableCell>
                News articles
                <br />
                Hosted events
                <br />
                Uploaded documents
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                We collect information about your committee memberships to
                provide you with the ability to manage your memberships. This
                information is stored for historical records. And will be
                anonymized upon request or when deleting an account.
              </TableCell>
              <TableCell>Committee Memberships</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h2
          id='rights'
          className='text-xl pb-2 mb-2 pt-4 tracking-wide border-b-2 border-yellow-400'
        >
          Your Rights
        </h2>
        <ul className='list-disc mb-2'>
          <li>
            You have the right to request access to your personal data stored on
            our site.
          </li>
          <li>
            You have the right to request the deletion of your personal data
            stored on our site.
            <br />
            <span className='text-sm text-red-500'>
              Note: Deletion of your account will result in the loss of all data
              however, all user-generated content will remain alongside
              committee membership assoiciations. This data will be anonymized
              for historical records.
            </span>
          </li>
          <li>
            You have the right to request the correction of your personal data
            stored on our site.
          </li>
          <li>
            You have the right to request the restriction of processing your
            personal data stored on our site.
          </li>
          <li>
            You have the right to object to the processing of your personal data
            stored on our site.
          </li>
          <li>
            You have the right to request the transfer of your personal data
            stored on our site.
          </li>
        </ul>
        All requests can be made by contacting and providing proof of persons,
        this includes first name, last name, and school email address (ending in
        @kth.se) to{' '}
        <a
          href='mailto:webmaster@medieteknik.com'
          target='_blank'
          className='text-sky-800'
        >
          webmaster@medieteknik.com
        </a>
        <h2
          id='3rd-party'
          className='text-xl pb-2 mb-2 pt-4 tracking-wide border-b-2 border-yellow-400'
        >
          3rd Party Data Processors
        </h2>
        <p>
          We use third-party services for the following purposes to process your
          data:
        </p>
        <br />
        <ul className='list-disc'>
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
      <CookieSection />
    </main>
  )
}
