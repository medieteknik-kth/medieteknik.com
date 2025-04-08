import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Comment from '@/components/ui/comment'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import type { Thread } from '@/models/Thread'

interface Props {
  language: LanguageCode
  invoice: InvoiceResponse
  thread?: Thread
}

export default function Comments({ language, invoice, thread }: Props) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Comments & Updates</h3>
        {thread && (
          <Badge variant='outline' className='text-xs'>
            {thread.messages?.length} messages
          </Badge>
        )}
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
        {thread?.messages && thread.messages.length > 0 ? (
          thread.messages.map((message) => {
            return (
              <Comment
                key={message.message_id}
                date={message.created_at}
                committeePosition={null}
                student={message.sender}
                message={{
                  message: message.content,
                  type: 'comment',
                }}
              />
            )
          })
        ) : (
          <div className='flex items-center justify-center w-full h-32 text-sm text-muted-foreground'>
            No comments yet.
          </div>
        )}
      </div>
    </div>
  )
}
