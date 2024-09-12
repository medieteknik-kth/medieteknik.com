import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import SidebarAuth from './client/sidebarAuth'
import {
  BookOpenIcon,
  DocumentIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import SidebarStatus from './client/sidebarStatus'
import { useTranslation } from '@/app/i18n'

interface Props {
  language: string
}

export default async function Sidebar({ language }: Props) {
  const { t } = await useTranslation(language, 'document')

  const categories = [
    {
      title: t('category.all'),
      icon: <BookOpenIcon className='w-6 h-6 mr-2' />,
    },
    {
      title: t('category.documents'),
      icon: <DocumentIcon className='w-6 h-6 mr-2 text-green-500' />,
    },
    {
      title: t('category.forms'),
      icon: <DocumentTextIcon className='w-6 h-6 mr-2 text-amber-500' />,
    },
  ]

  return (
    <div className='w-60 absolute h-full left-0 border-r py-3 px-4 flex flex-col gap-4'>
      <SidebarAuth language={language} />
      <SidebarStatus language={language} />

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-semibold tracking-wide'>
          {t('categories.type')}
        </h3>

        <TabsList className='flex flex-col gap-2 h-fit'>
          {categories.map((category, index) => (
            <TabsTrigger asChild key={index} value={category.title}>
              <Button
                variant='outline'
                className='w-full !justify-start'
                title={category.title}
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
