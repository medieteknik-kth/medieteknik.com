import { useTranslation } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import SidebarAuth from './sidebar/client/sidebarAuth'
import SidebarStatus from './sidebar/client/sidebarStatus'
import { documentCategories } from './utility/util'

import type { JSX } from 'react'

interface Props {
  language: string
}

/**
 * @name Sidebar
 * @description A component that displays the sidebar for the document management page.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
 * @returns {Promise<JSX.Element>} The JSX code for the Sidebar component.
 */
export default async function Sidebar({
  language,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'document')

  return (
    <div className='w-60 absolute h-full left-0 border-r py-3 px-4 lg:flex flex-col gap-4 hidden'>
      <SidebarAuth language={language} />
      <SidebarStatus language={language} />

      <div className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold tracking-wide'>
          {t('categories.type')}
        </h2>

        <TabsList className='flex flex-col gap-2 h-fit'>
          {documentCategories(t).map((category, index) => (
            <TabsTrigger asChild key={index} value={category.title}>
              <Button
                variant='outline'
                className='w-full !justify-start'
                title={category.title}
                id={category.title}
              >
                {category.icon}
                <p>{category.title}</p>
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <Separator />
    </div>
  )
}
