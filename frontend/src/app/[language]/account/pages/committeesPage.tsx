'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import {
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  Cog8ToothIcon,
  Square2StackIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Logo from 'public/images/logo.webp'
import { JSX, useState } from 'react'

const committeeData = [
  {
    name: 'Styrelsen',
    position: 'Ordförande',
    metadata: {
      joined: '2021-01-01',
      members: 20,
    },
  },
  {
    name: 'Committee Name 2',
    position: 'Committee Position 2',
    metadata: {
      joined: '2021-01-01',
      members: 15,
    },
  },
  {
    name: 'Committee Name 3',
    position: 'Committee Position 3',
    metadata: {
      joined: '2021-01-01',
      members: 10,
    },
  },
  {
    name: 'Committee Name 4',
    position: 'Committee Position 4',
    metadata: {
      joined: '2021-01-01',
      members: 10,
    },
  },
  {
    name: 'Committee Name 5',
    position: 'Committee Position 5',
    metadata: {
      joined: '2021-01-01',
      members: 10,
    },
  },
  {
    name: 'Committee Name 6',
    position: 'Committee Position 6',
    metadata: {
      joined: '2021-01-01',
      members: 10,
    },
  },
  {
    name: 'Committee Name 7',
    position: 'Committee Position 7',
    metadata: {
      joined: '2021-01-01',
      members: 10,
    },
  },
  {
    name: 'Committee Name 8',
    position: 'Committee Position 8',
    metadata: {
      joined: '2021-01-01',
      members: 10,
    },
  },
]

interface Props {
  language: string
}

/**
 * @name CommitteesPage
 * @description This is the page for the user to view their committee affiliations.
 *
 * @param {Props} props
 * @param {string} props.language The language of the page.
 *
 * @returns {JSX.Element} The page for the user to view their committee affiliations.
 */
export default function CommitteesPage({ language }: Props): JSX.Element {
  const { committees } = useAuthentication()
  // TODO: Redesign this component.
  const [display, setDisplay] = useState('card')

  if (committees.length === 0) {
    return (
      <section className='grow h-full min-h-[1080px] relative dark:bg-[#111] overflow-hidden'>
        <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
          <h1 className='text-2xl py-4'>Committee Affiliations</h1>
        </div>
        <div className='w-full grid place-items-center'>
          <h2 className='text-xl py-8'>
            You are not affiliated with any committees.
          </h2>
          <p>Look at committees that are recruiting if you are interested.</p>
          <Link href={`/${language}/bulletin#recruiting`}>
            <Button className='my-4'>View Recruitments</Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className='grow h-full min-h-[1080px] relative dark:bg-[#111] overflow-hidden'>
      <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-2xl py-4'>Committee Affiliations</h1>
      </div>

      <Card className='w-72 h-fit absolute left-10 bottom-0 top-24 xl:top-0 xl:my-auto z-10'>
        <CardHeader>
          <CardTitle>Display Type</CardTitle>
          <CardDescription>Display format</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-row xl:flex-col'>
          <Button
            variant={display === 'card' ? 'default' : 'outline'}
            onClick={() => setDisplay('card')}
            className='w-full mr-2 xl:mr-0 mb-0 xl:mb-2'
            disabled={display === 'card'}
            title='Card display'
          >
            <Square2StackIcon className='w-6 h-6 mr-2' />
            <span>Card</span>
          </Button>
          <Button
            variant={display === 'list' ? 'default' : 'outline'}
            onClick={() => setDisplay('list')}
            className='w-full mb-0 xl:mb-2'
            disabled={display === 'list'}
            title='List display'
          >
            <Bars3Icon className='w-6 h-6 mr-2' />
            <span>List</span>
          </Button>
        </CardContent>
      </Card>

      {(display === 'card' && (
        <div className='grow h-[650px] overflow-x-auto relative py-10 top-56  ml-10 xl:ml-96 mr-10 xl:pr-20'>
          <div className='absolute h-fit grid grid-rows-2 grid-flow-col gap-8 lg:pr-0'>
            {committeeData.map((committee, index) => (
              <Card
                key={index}
                className='w-72 h-64 flex flex-col justify-between'
              >
                <CardHeader className='flex flex-row items-center'>
                  <Avatar className='border-12 border-black rounded-full dark:border-white'>
                    <AvatarImage src={Logo.src} alt='Committe Logo' />
                    <AvatarFallback>Committee Picture</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center'>
                    <CardTitle className='px-4'>{committee.name}</CardTitle>
                    <CardDescription className='px-4'>
                      {committee.position}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className='relative grid grid-cols-1 gap-4'>
                  <Button asChild>
                    <Link
                      href={`./chapter/committees/${committee.name.toLocaleLowerCase()}/manage`}
                    >
                      <span>Manage</span>
                    </Link>
                  </Button>
                  <Button variant='outline'>
                    <Link
                      href={`./chapter/committees/${committee.name.toLocaleLowerCase()}`}
                    >
                      <span>Go To Page</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )) || (
        <div className='relative top-60 xl:top-0 pl-10 xl:pl-96 pr-10 xl:pr-20 place-items-center pt-6 pb-10'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[270px]'>Committee</TableHead>
                <TableHead className='w-[270px]'>Position</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className='min-w-40 w-fit'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {committeeData.map((committee, index) => (
                <TableRow key={index}>
                  <TableCell className='flex items-center'>
                    <Avatar className='mr-2 border border-black rounded-full dark:border-white'>
                      <AvatarImage src={Logo.src} alt='Committee Logo' />
                      <AvatarFallback>Committee Picture</AvatarFallback>
                    </Avatar>
                    {committee.name}
                  </TableCell>
                  <TableCell>{committee.position}</TableCell>
                  <TableCell>{committee.metadata.joined}</TableCell>
                  <TableCell>{committee.metadata.members}</TableCell>
                  <TableCell className='grid grid-cols-2'>
                    <Button asChild size='icon'>
                      <Link
                        href={`./chapter/committees/${committee.name.toLocaleLowerCase()}/manage`}
                        title='Manage'
                        aria-label='Manage'
                      >
                        <Cog8ToothIcon className='w-6 h-6' />
                      </Link>
                    </Button>
                    <Button variant='outline' size='icon'>
                      <Link
                        href={`./chapter/committees/${committee.name.toLocaleLowerCase()}`}
                        title='Go To Page'
                        aria-label='Go To Page'
                      >
                        <ArrowTopRightOnSquareIcon className='w-6 h-6' />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}
