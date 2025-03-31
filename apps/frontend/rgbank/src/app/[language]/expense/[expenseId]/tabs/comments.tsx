import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Comment, { StatusUpdate } from '@/components/ui/comment'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export default function Comments() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Comments & Updates</h3>
        <Badge variant='outline' className='text-xs'>
          7 comments
        </Badge>
      </div>

      <div className='space-y-3'>
        <Textarea
          placeholder='Add a comment or question about this expense...'
          className='min-h-[100px]'
        />
        <div className='flex justify-end gap-2'>
          <Button variant={'outline'}>Add Attachment</Button>
          <Button>Add Comment</Button>
        </div>
      </div>

      <Separator />
      <div className='space-y-4'>
        <Comment
          date={'2023-10-01T12:00:00Z'}
          committeePosition={null}
          student={null}
          notSameUser
          message={{
            message: 'This is a comment',
            type: 'comment',
          }}
        />
        <Comment
          date={'2023-10-01T12:00:00Z'}
          committeePosition={null}
          student={null}
          message={{
            message: 'This is a comment',
            type: 'comment',
          }}
        />
        <StatusUpdate
          newStatus='approved'
          previousStatus='pending'
          date='2023-10-01T12:00:00Z'
        />
        <Comment
          date={'2023-10-01T12:00:00Z'}
          committeePosition={null}
          student={null}
          message={{
            message: 'This is a comment',
            type: 'comment',
          }}
        />
        <StatusUpdate
          newStatus='pending'
          previousStatus='rejected'
          date='2023-10-01T12:00:00Z'
        />
      </div>
    </div>
  )
}
