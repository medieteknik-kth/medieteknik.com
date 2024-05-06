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
import Student from '@/models/Student'
import { CommitteePosition } from '@/models/Committee'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  StudentTooltip,
  CommitteePositionTooltip,
} from '@/components/tooltips/Tooltip'

interface CommitteePositionOccupant extends Student {
  position: CommitteePosition
}

const data: CommitteePositionOccupant[] = [
  {
    type: 'student',
    email: 'andree4@kth.se',
    firstName: 'André',
    lastName: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    receptionName: '',
    profilePictureUrl: Logo.src,
  },
  {
    type: 'student',
    email: 'andree4@kth.se',
    firstName: 'André',
    lastName: 'Eriksson',
    position: { name: 'Vice-Ordförande', description: 'Vice-Ordförande' },
    receptionName: '',
    profilePictureUrl: Logo.src,
  },
  {
    type: 'student',
    email: 'andree4@kth.se',
    firstName: 'André',
    lastName: 'Eriksson',
    position: { name: 'Kassör', description: 'Kassör' },
    receptionName: '',
    profilePictureUrl: Logo.src,
  },
  {
    type: 'student',
    email: 'andree4@kth.se',
    firstName: 'André',
    lastName: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    receptionName: '',
    profilePictureUrl: Logo.src,
  },
  {
    type: 'student',
    email: 'andree4@kth.se',
    firstName: 'André',
    lastName: 'Eriksson',
    position: { name: 'Ordförande', description: 'Ordförande' },
    receptionName: '',
    profilePictureUrl: Logo.src,
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
                      <p>{student.firstName + ' ' + student.lastName}</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <StudentTooltip student={student} />
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
                      <CommitteePositionTooltip
                        position={student.position}
                        committee={{
                          type: 'committee',
                          name: committee,
                          email: committee + '@medieteknik.com',
                          logoUrl: Logo.src,
                        }}
                      />
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
