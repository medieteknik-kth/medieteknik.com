import HeaderGap from '@/components/header/components/HeaderGap'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LanguageCode } from '@/models/Language'
import {
  ChevronDownIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Admin({
  params: { language },
}: {
  params: { language: LanguageCode }
}) {
  return (
    <main>
      <HeaderGap />
      <Tabs
        defaultValue='dashboard'
        className='w-full flex h-fit px-2'
        orientation='vertical'
      >
        <section className='w-72 h-[1080px] border rounded-md my-2 shadow-sm bg-[#EEE]'>
          <TabsList className='flex flex-col gap-2 h-fit'>
            <TabsTrigger
              value='dashboard'
              className='w-full flex justify-start gap-2 items-center'
            >
              <PresentationChartLineIcon className='w-7 h-7' />
              Dashboard
            </TabsTrigger>
          </TabsList>
          <TabsList className='flex flex-col gap-2 h-fit'>
            <TabsTrigger
              value='students'
              className='w-full flex justify-start gap-2 items-center'
            >
              <UsersIcon className='w-7 h-7' />
              Students
            </TabsTrigger>
            <TabsTrigger
              value='committees'
              className='w-full flex justify-start gap-2 items-center'
            >
              <UserGroupIcon className='w-7 h-7' />
              Committees
            </TabsTrigger>
          </TabsList>
        </section>
        <section className='grow h-[1080px] px-4'>
          <TabsContent value='dashboard'></TabsContent>
          <TabsContent value='students'>
            <div className='flex justify-between items-center py-2'>
              <h1 className='text-3xl tracking-tight font-bold'>
                Student Management
              </h1>
            </div>

            <div className='w-[650px] h-fit border rounded-md flex items-center justify-between px-4'>
              <div className='flex items-center gap-2 py-2'>
                <div className='w-12 h-12 bg-white rounded-full border' />
                <div className='flex flex-col justify-center'>
                  <p className=''>André Eriksson</p>
                  <Link
                    href={`mailto:andree4@kth.se`}
                    className='text-sm leading-3 text-neutral-700 hover:underline underline-offset-4'
                  >
                    andree4@kth.se
                  </Link>
                </div>
              </div>

              <ChevronDownIcon className='w-5 h-5' />
            </div>
            <div>
              <p className='text-red-500'>Not implemented yet</p>
            </div>
          </TabsContent>
          <TabsContent value='committees'>
            <div className='flex justify-between items-center py-2'>
              <h1 className='text-3xl tracking-tight font-bold'>
                Committee Management
              </h1>
            </div>
          </TabsContent>
        </section>
      </Tabs>
    </main>
  )
}
