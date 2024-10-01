import React from 'react'
import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'
import {
  IdentificationIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
const StudentPositions = React.lazy(() => import('./positionsTab'))
const StudentNews = React.lazy(() => import('./newsTab'))
const StudentEvents = React.lazy(() => import('./eventTab'))
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Logo from 'public/images/logo.webp'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Loading from '@/components/tooltips/Loading'
import { GetStudentPublic } from '@/api/student'
import Image from 'next/image'
import EditProfile from './client/editButton'

function SocialMediaDisplay({
  url,
  socialMediaBaseURL,
  icon,
}: {
  url: string
  socialMediaBaseURL: string
  icon: JSX.Element
}) {
  return (
    <Button
      asChild
      variant='ghost'
      className='hover:fill-yellow-400 justify-start'
    >
      <Link
        href={`${url}`}
        target='_blank'
        rel='noreferrer noopener'
        className='w-full flex gap-2 max-w-[238px] overflow-hidden'
      >
        {icon}
        <p>{url.replace(socialMediaBaseURL, '').replace('/', '')}</p>
      </Link>
    </Button>
  )
}

export default async function StudentPage({
  params: { language, studentId },
}: {
  params: { language: string; studentId: string }
}) {
  const data = await GetStudentPublic(studentId, language, true)
  // TODO: Fix data return type
  if (!data) return <></>

  return (
    <main>
      <div className='h-24 bg-black' />
      <section
        id='details'
        className='h-96 bg-[#EEE] dark:bg-[#222] border-b-4 border-yellow-400 relative flex items-center justify-between px-44'
      >
        <div className='w-1/2 h-1/2 flex items-center ml-24 text-black dark:text-yellow-400'>
          <Avatar className='w-52 h-auto aspect-square bg-white border-4 border-yellow-400 shadow-md'>
            <AvatarImage
              src={data.student.profile_picture_url}
              alt='Profile Picture'
              width={256}
              height={256}
            />
            <AvatarFallback className='bg-white'>
              <Image src={Logo} alt='Logo' width={256} height={256} />
            </AvatarFallback>
          </Avatar>
          <div className='w-[512px] relative h-full flex flex-col justify-center ml-12 '>
            <h1 className='text-5xl tracking-wide dark:text-white'>
              {data.student.first_name + ' ' + (data.student.last_name || '')}
            </h1>
            <Link
              href={`mailto:${data.student.email}`}
              className='text-xl tracking-wide hover:underline underline-offset-4 text-sky-700 dark:text-yellow-400'
              title='Send an email'
            >
              {data.student.email}
            </Link>
            <div className='absolute -bottom-8'>
              <EditProfile language={language} currentStudent={data.student} />
            </div>
          </div>
        </div>
        {data.profile && (
          <Card className='w-72'>
            <CardHeader>
              <CardTitle className='flex justify-between items-center'>
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-2'>
                {data.profile.facebook_url && (
                  <SocialMediaDisplay
                    socialMediaBaseURL='https://www.facebook.com/'
                    url={data.profile.facebook_url}
                    icon={<FacebookSVG className='w-6 h-6' />}
                  />
                )}
                {data.profile.linkedin_url && (
                  <SocialMediaDisplay
                    socialMediaBaseURL='https://www.linkedin.com/in/'
                    url={data.profile.linkedin_url}
                    icon={<LinkedInSVG className='w-6 h-6' />}
                  />
                )}
                {data.profile.instagram_url && (
                  <SocialMediaDisplay
                    socialMediaBaseURL='https://www.instagram.com/'
                    url={data.profile.instagram_url}
                    icon={<InstagramSVG className='w-6 h-6' />}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
      <section id='tabs' className='w-full h-fit px-20 text-black'>
        <Tabs
          defaultValue='positions'
          className='w-full h-fit flex flex-col items-center'
        >
          <TabsList className='min-w-96 h-fit my-3 grid grid-cols-3 *:py-4 gap-1'>
            <TabsTrigger
              value='positions'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              <IdentificationIcon className='w-6 h-6 mr-2' />
              <p>Positions</p>
            </TabsTrigger>
            <TabsTrigger
              value='news'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              <DocumentTextIcon className='w-6 h-6 mr-2' />
              <p>News</p>
            </TabsTrigger>
            <TabsTrigger
              value='posts'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              <CalendarDaysIcon className='w-6 h-6 mr-2' />
              <p>Events</p>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='positions' className='my-14 px-20'>
            <React.Suspense fallback={<Loading language={language} />}>
              <StudentPositions
                language={language}
                positions={data.memberships}
              />
            </React.Suspense>
          </TabsContent>
          <TabsContent value='news' className='my-14 px-20'>
            <React.Suspense fallback={<Loading language={language} />}>
              <StudentNews language={language} student={data.student} />
            </React.Suspense>
          </TabsContent>
          <TabsContent value='posts' className='my-14 px-20'>
            <React.Suspense fallback={<Loading language={language} />}>
              <StudentEvents language={language} student={data.student} />
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
