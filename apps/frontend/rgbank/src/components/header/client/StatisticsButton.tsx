'use client'

import { Button } from '@/components/ui/button'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { ChartPieIcon } from '@heroicons/react/24/outline'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function StatisticsButton({ language }: Props) {
  const { isAuthenticated } = useAuthentication()

  return (
    <Button
      asChild
      variant={'ghost'}
      size='icon'
      className={`relative md:hidden flex w-full h-full items-center justify-center ${!isAuthenticated ? 'col-start-3' : ''}`}
    >
      <Link href={`/${language}/statistics`}>
        <ChartPieIcon className='w-7 h-7' />
      </Link>
    </Button>
  )
}
