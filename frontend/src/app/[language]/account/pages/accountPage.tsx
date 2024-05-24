import React from 'react'

const AccountForm = React.lazy(() => import('./account/accountForm'))
const ReceptionForm = React.lazy(() => import('./account/receptionForm'))
import { Button } from '@/components/ui/button'
import { AcademicCapIcon } from '@heroicons/react/24/outline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AccountPage({ language }: { language: string }) {
  return (
    <section className='grow h-fit dark:bg-[#111]'>
      <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-2xl py-4'>Account Settings</h1>
      </div>
      <div className='w-full h-fit flex justify-center my-2'>
        <Tabs defaultValue='account' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 *:py-2'>
            <TabsTrigger
              value='account'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value='reception'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              Reception
            </TabsTrigger>
          </TabsList>
          <TabsContent value='account'>
            <React.Suspense fallback={<div>Loading...</div>}>
              <AccountForm params={{ language }} />
            </React.Suspense>
          </TabsContent>
          <TabsContent value='reception'>
            <React.Suspense fallback={<div>Loading...</div>}>
              <ReceptionForm params={{ language }} />
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
