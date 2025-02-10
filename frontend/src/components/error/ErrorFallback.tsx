import { fontJetBrainsMono } from '@/app/fonts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { JSX } from 'react'

interface Props {
  error: Error
}

/**
 * Renders the error fallback UI.
 * @name ErrorFallback
 * @description The fallback render for {@link ErrorBoundary}
 *
 * @returns {JSX.Element} The error fallback
 */
export default function ErrorFallback({ error }: Props): JSX.Element {
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center gap-4'>
      <div className='flex flex-col items-center gap-2'>
        <h1 className='text-4xl sm:text-6xl font-bold tracking-tight text-center'>
          An error occurred
        </h1>
        <p className='text-xl'>Please try again later.</p>
      </div>
      <Button asChild>
        <a href='/'>Go back to the homepage</a>
      </Button>
      <div className='text-sm flex flex-col items-center text-center'>
        <p>If you need assistance, please mail us at</p>
        <Link
          href='mailto:webmaster@medieteknik.com'
          className='text-blue-500 hover:underline'
        >
          webmaster@medieteknik.com
        </Link>
      </div>
      <Accordion
        type='single'
        className='text-sm flex flex-col items-center gap-2 w-full max-w-4xl px-4'
      >
        <AccordionItem value='error' className='w-full max-w-4xl'>
          <AccordionTrigger>Error Information</AccordionTrigger>
          <AccordionContent className='flex flex-col gap-2 w-full'>
            <p className='text-sm'>
              The following information can be useful when reporting the error.
              Please include this information in your email.
            </p>
            <Separator className='bg-yellow-400' />
            <div className='relative flex flex-col gap-2 w-full'>
              <div>
                <p className='font-semibold'>Page</p>
                <code
                  className={`${fontJetBrainsMono.className} text-xs block`}
                >
                  {window.location.href}
                </code>
              </div>
              <div>
                <p className='font-semibold'>Name</p>
                <code
                  className={`${fontJetBrainsMono.className} text-xs block`}
                >
                  {error.name}
                </code>
              </div>
              <div>
                <p className='font-semibold'>Message</p>
                <code
                  className={`${fontJetBrainsMono.className} text-xs block`}
                >
                  {error.message}
                </code>
              </div>
              {error.stack && (
                <div className='w-full'>
                  <p className='font-semibold'>Stack</p>
                  <code
                    className={`${fontJetBrainsMono.className} text-red-500 text-xs block w-full text-wrap overflow-x-auto`}
                  >
                    {error.stack}
                  </code>
                </div>
              )}
              <Button
                size={'icon'}
                variant={'ghost'}
                className='absolute top-0 right-0'
                title='Copy error information'
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.href}\n\n${error.name}\n\n${error.message}\n\n${error.stack}`
                  )
                  toast({
                    title: 'Copied error information',
                    description: 'The error information has been copied.',
                  })
                }}
              >
                <ClipboardDocumentIcon className='w-6 h-6' />
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
