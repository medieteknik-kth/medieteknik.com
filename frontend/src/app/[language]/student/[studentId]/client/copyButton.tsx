'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ClipboardIcon } from '@heroicons/react/24/outline'

export default function CopyButton({
  language,
  url,
}: {
  language: string
  url: string
}) {
  const { toast } = useToast()

  return (
    <Button
      variant='outline'
      size={'icon'}
      onClick={() => {
        navigator.clipboard.writeText(
          window.location.origin + '/' + language + url
        )
        toast({
          title: 'Copied to clipboard',
          description: window.location.origin + '/' + language + url,
          duration: 2500,
        })
      }}
    >
      <ClipboardIcon className='w-6 h-6' />
    </Button>
  )
}
