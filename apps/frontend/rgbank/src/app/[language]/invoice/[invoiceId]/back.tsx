'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function BackButton() {
  return (
    <Button
      variant='ghost'
      className='flex items-center gap-2 text-sm text-muted-foreground hover:bg-transparent'
      aria-label='Back'
      onClick={() => {
        window.history.back()
      }}
    >
      <ChevronLeftIcon className='h-4 w-4' />
      Back
    </Button>
  )
}
