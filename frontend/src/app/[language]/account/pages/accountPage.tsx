'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Loading from '@components/tooltips/Loading'
import { useTranslation } from '@/app/i18n/client'
const AccountForm = React.lazy(() => import('./account/accountForm'))
const ProfileForm = React.lazy(() => import('./account/profileForm'))
const ReceptionForm = React.lazy(() => import('./account/receptionForm'))

export default function AccountProfile({ language }: { language: string }) {
  const { t } = useTranslation(language, 'account')
  return (
    <section className='grow h-fit dark:bg-[#111]'>
      <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-2xl py-4'>{t('title')}</h1>
      </div>
      <div className='w-full h-fit flex justify-center my-2'>
        <Tabs defaultValue='account' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 *:py-2'>
            <TabsTrigger
              value='account'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              {t('tab_account')}
            </TabsTrigger>
            <TabsTrigger
              disabled
              value='reception'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              {t('tab_reception')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value='account'>
            <React.Suspense fallback={<Loading language={language} />}>
              <div className='grid grid-cols-1 2xl:grid-cols-2 gap-2 relative'>
                <AccountForm language={language} />
                <ProfileForm language={language} />
              </div>
            </React.Suspense>
          </TabsContent>
          <TabsContent value='reception'>
            <React.Suspense fallback={<Loading language={language} />}>
              <ReceptionForm language={language} />
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
