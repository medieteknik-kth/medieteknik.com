'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import type Student from '@/models/Student'
import {
  ArrowPathRoundedSquareIcon,
  ArrowUpTrayIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'

import type { JSX } from 'react'

interface Props {
  student: Student
}

/**
 * @name CalendarExport
 * @description This component is a dialog that allows the user to subscribe or export their calendar.
 *
 * @param {Props} props
 * @param {Student} props.student - The student opening the dialog
 *
 * @returns {JSX.Element} The calendar export dialog
 */
export default function CalendarExport({ student }: Props): JSX.Element {
  const { toast } = useToast()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'outline'} title='Subscribe or Export'>
          <ArrowUpTrayIcon className='w-6 h-6' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe or Export Calendar</DialogTitle>
          <DialogDescription>
            Subscribe or export your calendar
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col'>
          <div className='flex items-center gap-2 mb-2'>
            <ArrowPathRoundedSquareIcon className='w-6 h-6' />
            <p>Subscribe</p>
          </div>
          <div className='grid grid-cols-12'>
            <p className='w-auto text-sm text-nowrap h-10 border rounded-md px-2 pt-1 pb-2 overflow-x-scroll overflow-y-hidden mr-2 col-span-11 grid items-center'>
              {`/api/calendar/ics?u=${student.student_id}`}
            </p>
            <Button
              size={'icon'}
              variant={'outline'}
              onClick={() => {
                // TODO: Double check the export API...
                navigator.clipboard.writeText(
                  `/api/calendar/ics?u=${student.student_id}`
                )
                toast({
                  title: 'Copied to clipboard',
                  description: `/api/calendar/ics?u=${student.student_id}`,
                  duration: 2500,
                })
              }}
              title='Copy to clipboard'
              className='z-10'
            >
              <ClipboardIcon className='w-6 h-6' />
            </Button>
          </div>
        </div>
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <ArrowUpTrayIcon className='w-6 h-6' />
            <p>Export</p>
          </div>
          <div className='flex gap-2 flex-wrap'>
            <Button asChild>
              <Link
                href={`/api/calendar/ics?u=${student.student_id}`}
                target='_blank'
              >
                Export to ICS
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
