import { Separator } from '@/components/ui/separator'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { useState } from 'react'

interface Props {
  language: LanguageCode
  committees?: Committee[]
}

type Subcategory = {
  id: string
  name: string
}

export type Lowercategory = {
  id: string
  name: string
  logo_url?: string
  subcategories: Subcategory[]
}

export type Category = {
  id: string
  name: string
  description: string
  lowercategories: Lowercategory[]
}

export default function SettingsPage({ language, committees }: Props) {
  const [upperCategoryOpen, setUpperCategoryOpen] = useState<
    Record<string, boolean>
  >({})
  const [lowerCategoryOpen, setLowerCategoryOpen] = useState<
    Record<string, boolean>
  >({})

  const upperCategories: Category[] = [
    {
      id: 'general',
      name: 'General',
      description: 'General settings for the application',
      lowercategories: [],
    },
    {
      id: 'committees',
      name: 'Committees',
      description: 'Settings for committees',
      lowercategories:
        committees?.map((committee) => ({
          id: committee.committee_id,
          name: committee.translations[0].title,
          logo_url: committee.logo_url,
          subcategories: [
            {
              id: 'test',
              name: 'Test subcategory',
            },
          ],
        })) || [],
    },
  ]

  const toggleUpperCategory = (category: string) => {
    setUpperCategoryOpen((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const toggleLowerCategory = (category: string) => {
    setLowerCategoryOpen((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  if (!committees) {
    return null
  }

  return (
    <section className='w-full h-fit max-w-[1100px] mb-8 2xl:mb-0'>
      <div className='-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>Settings</h2>
        <p className='text-sm text-muted-foreground'>
          This page shows the settings for the application. You can change the
          settings here.
        </p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>

    </section>
  )
}
