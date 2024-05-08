import React from 'react'
import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'
import {
  UserCircleIcon,
  Cog8ToothIcon,
  AtSymbolIcon,
  AcademicCapIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
const StudentPositions = React.lazy(() => import('./positionsTab'))
const StudentNews = React.lazy(() => import('./newsTab'))
const StudentEvents = React.lazy(() => import('./eventTab'))
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Logo from 'public/images/logo.png'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function UserPage({
  params: { studentId, language },
}: {
  params: { studentId: string; language: string }
}) {
  const hasAnyPostion = true
  return (
    <main>
      <div className='h-24 bg-black' />
      <section
        id='details'
        className='h-96 bg-[#111] border-b-4 border-yellow-400 relative flex items-center justify-between px-44'
      >
        <div className='w-1/2 h-1/2 flex items-center ml-24 text-white'>
          <Avatar className='w-52 h-auto border-2 border-white'>
            <AvatarImage src={Logo.src} alt='Profile Picture' />
            <AvatarFallback>Profile Picture</AvatarFallback>
          </Avatar>
          <div className='w-[512px] relative h-full flex flex-col justify-center ml-12 '>
            <h1 className='text-5xl tracking-wider'>André Eriksson</h1>
            <div className='absolute bottom-4'>
              <Button
                asChild
                variant='outline'
                className='text-foreground'
                title='Edit Profile'
                aria-label='Edit Profile'
              >
                <Link href='../account' className='flex items-center'>
                  <Cog8ToothIcon className='w-6 h-6' />
                  <p className='ml-2'>Edit Profile</p>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Card className='w-72'>
          <CardHeader>
            <CardTitle className='flex justify-between items-center'>
              Profile
              <Button
                asChild
                variant='outline'
                size='icon'
                title='Edit Profile'
                aria-label='Edit Profile'
              >
                <Link href='../account'>
                  <Cog8ToothIcon className='w-6 h-6' />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col'>
              <div className='flex items-center pb-2'>
                <AtSymbolIcon className='w-6 h-6' />
                <Button asChild variant='link'>
                  <Link href='mailto:andree4@kth.se' target='_blank'>
                    andree4@kth.se
                  </Link>
                </Button>
              </div>
              <div className='flex items-center py-2'>
                <AcademicCapIcon className='w-6 h-6' />
                <span className='px-4'>1st Year</span>
              </div>
              <div className='grid grid-cols-3 py-2'>
                <Button
                  asChild
                  size='icon'
                  variant='ghost'
                  className='hover:fill-yellow-400'
                >
                  <Link href='/'>
                    <FacebookSVG className='w-6 h-6' />
                  </Link>
                </Button>
                <Button
                  asChild
                  size='icon'
                  variant='ghost'
                  className='hover:fill-yellow-400'
                >
                  <Link href='/'>
                    <LinkedInSVG className='w-6 h-6' />
                  </Link>
                </Button>
                <Button
                  asChild
                  size='icon'
                  variant='ghost'
                  className='hover:fill-yellow-400'
                >
                  <Link href='/'>
                    <InstagramSVG className='w-6 h-6' />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
              <p>
                News
                <span>{' (20)'}</span>
              </p>
            </TabsTrigger>
            <TabsTrigger
              value='posts'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              <CalendarDaysIcon className='w-6 h-6 mr-2' />
              <p>
                Events
                <span>{' (5)'}</span>
              </p>
            </TabsTrigger>
          </TabsList>
          <TabsContent value='positions' className='my-14 px-20'>
            <React.Suspense fallback={<div>Loading...</div>}>
              <StudentPositions
                language={language}
                student={{
                  type: 'student',
                  email: 'andree4@kth.se',
                  firstName: 'André',
                  lastName: 'Eriksson',
                  profilePictureUrl: Logo.src,
                  receptionName: '',
                }}
              />
            </React.Suspense>
          </TabsContent>
          <TabsContent value='news' className='my-14 px-20'>
            <React.Suspense fallback={<div>Loading...</div>}>
              <StudentNews
                language={language}
                student={{
                  type: 'student',
                  email: 'andree4@kth.se',
                  firstName: 'André',
                  lastName: 'Eriksson',
                  profilePictureUrl: Logo.src,
                  receptionName: '',
                }}
              />
            </React.Suspense>
          </TabsContent>
          <TabsContent value='posts' className='my-14 px-20'>
            <React.Suspense fallback={<div>Loading...</div>}>
              <StudentEvents
                language={language}
                student={{
                  type: 'student',
                  email: 'andree4@kth.se',
                  firstName: 'André',
                  lastName: 'Eriksson',
                  profilePictureUrl: Logo.src,
                  receptionName: '',
                }}
              />
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
