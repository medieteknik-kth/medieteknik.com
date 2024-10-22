import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JSX } from 'react'
import AccountNewsPage from './item/news'

interface Props {
  language: string
}

/**
 * @name ItemsPage
 * @description The component that renders the items page, allowing the user to view news, documents and albums
 *
 * @param {Props} props
 * @param {string} props.language - The language of the items page
 *
 * @returns {JSX.Element} The items page
 */
export default function ItemsPage({ language }: Props): JSX.Element {
  return (
    <section className='grow h-full relative dark:bg-[#111]'>
      <div className='w-full flex items-center justify-center border-b-2 border-yellow-400'>
        <h1 className='text-2xl py-4'>Items</h1>
      </div>
      <div className='w-full h-fit flex justify-center my-2'>
        <Tabs defaultValue='news' className='w-full'>
          <TabsList className='grid w-full grid-cols-3 *:py-2'>
            <TabsTrigger
              value='news'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              News
            </TabsTrigger>
            <TabsTrigger
              value='documents'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value='albums'
              className='text-black dark:text-white border-b-2 aria-selected:border-yellow-400'
            >
              Albums
            </TabsTrigger>
          </TabsList>
          <TabsContent value='news'>
            <AccountNewsPage language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
