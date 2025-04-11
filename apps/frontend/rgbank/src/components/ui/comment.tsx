import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import type { CommitteePosition } from '@/models/Committee'
import type { ExpenseStatus } from '@/models/General'
import type Student from '@/models/Student'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'

type CommentType = 'update' | 'comment'

interface CommentProps {
  student: Student | null // Null for system messages
  committeePosition: CommitteePosition | null // Null for system messages
  notSameUser?: boolean // Left or right aligned
  message: {
    type: CommentType
    message: string
  }
  date: string
  className?: string
}

interface StatusUpdateProps {
  date: string
  previousStatus: ExpenseStatus
  newStatus: ExpenseStatus
  message?: string
}

export default function Comment({
  student,
  committeePosition,
  notSameUser,
  date,
  message,
  className,
}: CommentProps) {
  return (
    <div
      className={`flex gap-4 ${notSameUser ? 'flex-row-reverse' : ''} ${className}`}
    >
      <div>
        {student?.profile_picture_url ? (
          <img
            src={student.profile_picture_url}
            alt={student.first_name}
            className='h-8 w-8 rounded-full'
          />
        ) : (
          <div className='p-1 bg-white'>
            <Image
              src={Logo.src}
              alt='Medieteknik Logo'
              width={32}
              height={32}
              className='h-8 w-8'
              unoptimized
              sizes='(max-width: 768px) 32px, (max-width: 1200px) 64px, 128px'
            />
          </div>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <div
          className={`flex items-center gap-2 ${notSameUser ? 'flex-row-reverse' : ''}`}
        >
          <p className='text-sm font-semibold'>
            {student ? (
              <>
                {student.first_name} {student.last_name}{' '}
              </>
            ) : (
              'System'
            )}
          </p>
          <p className='text-xs text-muted-foreground'>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className={notSameUser ? 'text-right' : ''}>
          <p>{message.message}</p>
        </div>
      </div>
    </div>
  )
}

export function StatusUpdate({
  date,
  previousStatus,
  newStatus,
  message,
}: StatusUpdateProps) {
  return (
    <div className='space-y-2'>
      <Separator />
      <div className='space-y-1'>
        <p>
          <span className='text-xs text-muted-foreground'>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </p>
        <div className='flex items-center gap-2'>
          <ExpenseStatusBadge status={previousStatus} className='' />
          <ArrowRightIcon className='h-4 w-4' />
          <ExpenseStatusBadge status={newStatus} className='' />
        </div>
        {message && <p className='text-sm text-muted-foreground'>{message}</p>}
      </div>
      <Separator />
    </div>
  )
}
