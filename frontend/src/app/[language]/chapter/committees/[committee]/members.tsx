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
      ></ul>
    </div>
  )
}
