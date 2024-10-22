import { useTranslation } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { documentCategories } from '../utility/util'

import type { JSX } from "react";

interface Props {
  language: string
}

/**
 * @name CategorySelect
 * @description A component that displays a list of categories for documents. Should only render on smaller screens.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
 * @returns {Promise<JSX.Element>} The JSX code for the CategorySelect component.
 */
export default async function CategorySelect({
  language,
}: Props): Promise<JSX.Element> {
  const { t } = await useTranslation(language, 'document')

  return (
    <TabsList className='flex gap-2 h-fit flex-wrap sm:flex-nowrap'>
      {documentCategories(t).map((category, index) => (
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
  )
}
