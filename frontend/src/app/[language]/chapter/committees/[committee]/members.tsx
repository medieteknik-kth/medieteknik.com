'use client'
import Logo from 'public/images/logo.png'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Student } from '@/models/Student'
import { CommitteePosition } from '@/models/Committee'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface CommitteePositionOccupant extends Student {
  position: CommitteePosition
}

const data: CommitteePositionOccupant[] = [
  {
    email: 'andree4@kth.se',
    first_name: 'André',
    last_name: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    reception_name: '',
  },
  {
    email: 'andree4@kth.se',
    first_name: 'André',
    last_name: 'Eriksson',
    position: { name: 'Vice-Ordförande', description: 'Vice-Ordförande' },
    reception_name: '',
  },
  {
    email: 'andree4@kth.se',
    first_name: 'André',
    last_name: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    reception_name: '',
  },
  {
    email: 'andree4@kth.se',
    first_name: 'André',
    last_name: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    reception_name: '',
  },
  {
    email: 'andree4@kth.se',
    first_name: 'André',
    last_name: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    reception_name: '',
  },
  {
    email: 'andree4@kth.se',
    first_name: 'André',
    last_name: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    reception_name: '',
  },
  {
    email: 'andree4@kth.se',
    first_name: 'André',
    last_name: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    reception_name: '',
  },
  {
    email: 'andree4@kth.se',
    first_name: 'André',
    last_name: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    reception_name: '',
  },
]

export default function CommitteeMembers({
  language,
  committee,
}: {
  language: string
  committee: string
}) {
  return (
    <div className='w-fit h-5/6 my-4 '>
      <ul
        className='w-fit h-fit max-h-[512px] pl-4 grid grid-cols-2 auto-rows-max gap-4 overflow-y-auto overflow-x-hidden'
        style={{ direction: 'ltr' }}
      >
        {data.map((student, index) => (
          <Card key={index} className='w-80 h-fit top-0 bottom-0 my-auto'>
            <CardHeader className='flex flex-row items-start'>
              <Avatar className='mr-2'>
                <AvatarImage src={Logo.src} alt='Profile Picture' />
                <AvatarFallback>Profile Picture</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>
                  <HoverCard>
                    <HoverCardTrigger className='flex items-center'>
                      <p>{student.first_name + ' ' + student.last_name}</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <Button
                        asChild
                        variant='link'
                        className='h-fit flex flex-col justify-center pb-0'
                      >
                        <Link
                          href='/'
                          className='group'
                          title='Go to profile page'
                        >
                          <Avatar className='w-24 h-24 border-2 border-black rounded-full mb-2 group-hover:scale-110 transition-transform'>
                            <AvatarImage
                              src={Logo.src}
                              alt='Committee Logo'
                              width={96}
                              height={96}
                            />
                            <AvatarFallback>Committee Picture</AvatarFallback>
                          </Avatar>
                          <p>{student.first_name + ' ' + student.last_name}</p>
                        </Link>
                      </Button>
                      <Button
                        variant='link'
                        className='text-neutral-500 py-0 w-full left-0 right-0 mx-auto z-10'
                      >
                        <Link href='mailto:' title='Send email to occupant'>
                          <span>andree4@kth.se</span>
                        </Link>
                      </Button>
                    </HoverCardContent>
                  </HoverCard>
                </CardTitle>
                <CardDescription>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Button
                        variant='link'
                        className='w-fit h-fit text-neutral-500 p-0 m-0'
                      >
                        {student.position.name}
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className='w-fit'>
                      <CardHeader className='flex flex-row items-center'>
                        <Avatar className='mr-2'>
                          <AvatarImage src={Logo.src} alt='Committee Logo' />
                          <AvatarFallback>Committee Picture</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <CardTitle>{student.position.name}</CardTitle>
                          <CardDescription className='capitalize'>
                            {committee}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className='text-lg font-bold'>Description</h3>
                        <p>{student.position.description}</p>
                      </CardContent>
                    </HoverCardContent>
                  </HoverCard>
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </ul>
    </div>
  )
}
