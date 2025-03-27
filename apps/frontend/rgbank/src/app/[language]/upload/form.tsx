'use client'

import Expense from '@/app/[language]/upload/expense'
import Invoice from '@/app/[language]/upload/invoice'
import SelectTemplate from '@/app/[language]/upload/select'
import { Tabs } from '@/components/ui/tabs'
import type Committee from '@/models/Committee'
import { TabsContent } from '@radix-ui/react-tabs'
import { useState } from 'react'

interface Props {
  committees: Committee[]
}

export default function UploadForm({ committees }: Props) {
  const [page, setPage] = useState('template')
  const [client, setClient] = useState(false)

  return (
    <div className='flex min-h-screen flex-col items-center justify-between container'>
      <Tabs value={page} onValueChange={setPage} className='w-full h-full'>
        <TabsContent
          value='template'
          className='bg-neutral-100 h-full w-full flex flex-col rounded-xl shadow-lg p-8'
        >
          <SelectTemplate
            onClickCallback={(template) => {
              console.log(template)
              setPage(template)
            }}
          />
          <div className='mt-auto text-center text-muted-foreground'>
            Page 1 of 2
          </div>
        </TabsContent>
        <TabsContent
          value='invoice'
          className='bg-neutral-100 h-full w-full flex flex-col rounded-xl shadow-lg p-8'
        >
          <Invoice />
          <div className='mt-auto text-center text-muted-foreground'>
            Page 2 of 2
          </div>
        </TabsContent>
        <TabsContent
          value='expense'
          className='bg-neutral-100 h-full w-full flex flex-col rounded-xl shadow-lg p-8'
        >
          <Expense committees={committees} />
          <div className='mt-auto text-center text-muted-foreground'>
            Page 2 of 2
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
