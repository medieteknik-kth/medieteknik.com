import {
  BookOpenIcon,
  DocumentIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { TFunction } from 'next-i18next'

import type { JSX } from 'react'

/**
 * @name TypeOfDocument
 * @description The type of document to display.
 *
 * @type {'all' | 'documents' | 'forms'}
 */
export type TypeOfDocument = 'all' | 'documents' | 'forms'

/**
 * @name documentCategories
 * @description A function that returns a list of categories for documents.
 *
 * @param {TFunction} t - The translation function for the component.
 * @returns {Array<{ title: string; icon: JSX.Element }>} The list of categories for documents.
 */
export const documentCategories = (
  t: TFunction
): { title: string; icon: JSX.Element }[] =>
  [
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
  ] as const
