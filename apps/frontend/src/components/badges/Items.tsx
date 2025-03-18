import { Badge } from '@/components/ui/badge'
import type { LanguageCode } from '@/models/Language'

function DraftBadge({ language }: { language: LanguageCode }) {
  return (
    <Badge className='bg-rose-600 hover:bg-rose-400 font-bold text-white'>
      DRAFT
    </Badge>
  )
}

function PublishedBadge({ language }: { language: LanguageCode }) {
  return (
    <Badge className='bg-green-600 hover:bg-green-400 font-bold text-white'>
      PUBLISHED
    </Badge>
  )
}

function UpcomingEventBadge({ language }: { language: LanguageCode }) {
  return (
    <Badge className='bg-amber-600 hover:bg-amber-400 font-bold text-white'>
      UPCOMING
    </Badge>
  )
}

function OngoingEventBadge({ language }: { language: LanguageCode }) {
  return (
    <Badge
      className='bg-fuchsia-600 hover:bg-fuchsia-400 font-bold text-white'
    >
      ONGOING
    </Badge>
  )
}

function CompletedEventBadge({ language }: { language: LanguageCode }) {
  return (
    <Badge className='bg-blue-600 hover:bg-blue-400 font-bold text-white'>
      COMPLETED
    </Badge>
  )
}

export {
  CompletedEventBadge,
  DraftBadge,
  OngoingEventBadge,
  PublishedBadge,
  UpcomingEventBadge,
}
