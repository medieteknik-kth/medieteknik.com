'use client'
import {
  ArrowTopRightOnSquareIcon,
  Square2StackIcon,
  Bars3Icon,
  UsersIcon,
  PencilSquareIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Logo from 'public/images/logo.png'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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

export default function CommitteesPage({
  params: { language },
}: {
  params: { language: string }
}) {
  const [display, setDisplay] = useState('card')
  return (
    <section className='grow h-full relative dark:bg-[#111]'>
      <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-2xl py-4'>Committee Affiliations</h1>
      </div>

      <Card className='h-fit absolute left-10 bottom-0 top-0 my-auto'>
        <CardHeader>
          <CardTitle>Display Type</CardTitle>
          <CardDescription>
            Choose how to display the committees
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col'>
          <Button
            variant={display === 'card' ? 'default' : 'outline'}
            onClick={() => setDisplay('card')}
            className='w-fit mb-2'
            disabled={display === 'card'}
            title='Card display'
          >
            <Square2StackIcon className='w-6 h-6 mr-2' />
            <span>Card</span>
          </Button>
          <Button
            variant={display === 'list' ? 'default' : 'outline'}
            onClick={() => setDisplay('list')}
            className='w-fit mb-2'
            disabled={display === 'list'}
            title='List display'
          >
            <Bars3Icon className='w-6 h-6 mr-2' />
            <span>List</span>
          </Button>
        </CardContent>
      </Card>

      {(display === 'card' && (
        <div className='w-1/2 h-[1000px] grid grid-cols-3 auto-rows-max place-items-center py-10 left-0 right-0 mx-auto gap-8'>
          {committeeData.map((committee, index) => (
            <Card key={index} className='w-fit min-w-72'>
              <CardHeader className='flex flex-row items-center'>
                <Avatar className='border-2 border-black rounded-full dark:border-white'>
                  <AvatarImage src={Logo.src} alt='Committe Logo' />
                  <AvatarFallback>Committee Picture</AvatarFallback>
                </Avatar>
                <div className='flex flex-col justify-center'>
                  <CardTitle className='px-4'>{committee.name}</CardTitle>
                  <CardDescription className='px-4'>
                    <p>{committee.position}</p>
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
      )) || (
        <div className='w-1/2 left-0 right-0 mx-auto grid place-items-center pt-6 pb-10'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[270px]'>Committee</TableHead>
                <TableHead className='w-[270px]'>Position</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className='w-40'>Actions</TableHead>
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