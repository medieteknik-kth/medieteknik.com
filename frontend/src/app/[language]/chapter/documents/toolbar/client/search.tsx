'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import {
  DocumentIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useCallback, useState } from 'react'

interface Props {
  language: string
}

/**
 * @name SearchBar
 * @description A component that displays a search bar for documents.
 * 
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
 * @returns {JSX.Element} The JSX code for the SearchBar component.
 */
export default function SearchBar({ language }: Props): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { documents } = useDocumentManagement()
  const { t } = useTranslation(language, 'document')
  const [searchBarFocused, setSearchBarFocused] = useState(false)
  const [mouseDown, setMouseDown] = useState(false)
  const [search, setSearch] = useState(searchParams.get('q') || '')

  const updateSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement> | undefined) => {
      if (!e) return

      setSearch(e.currentTarget.value)
    },
    []
  )

  const createQuery = useCallback(
    (searchQuery: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('q', searchQuery)
      return params.toString()
    },
    [searchParams]
  )

  return (
    <form
      className='w-full lg:w-fit flex gap-2 items-center relative'
      onSubmit={(e) => {
        e.preventDefault()
        if (search.length < 2) {
          router.push(`${pathname}`)
        } else {
          router.push(`${pathname}?${createQuery(search.toLowerCase())}`)
        }
      }}
    >
      <Input
        type='search'
        className='flex-grow lg:w-96'
        placeholder={t('search')}
        value={search}
        onChange={updateSearch}
        onFocus={() => setSearchBarFocused(true)}
        onBlur={() => {
          if (!mouseDown) {
            setSearchBarFocused(false)
          }
        }}
      />
      <Button
        size={'icon'}
        type='submit'
        className='!w-10 h-10'
        title='Deep search'
        aria-label='Deep search button'
      >
        <MagnifyingGlassIcon className='w-6 h-6' />
      </Button>
      {search.length >= 2 && searchBarFocused && (
        <div
          className='w-96 min-h-8 absolute left-0 top-10 border rounded-md bg-white py-2 z-20'
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={() => setMouseDown(false)}
        >
          <ul className='flex flex-col gap-2'>
            {documents
              .filter((d) => {
                const title = d.translations[0].title.toLowerCase()
                const searchTerm = search
                  .toLowerCase()
                  .replace(/a/g, '[aäå]')
                  .replace(/o/g, '[oö]')
                const regex = new RegExp(searchTerm, 'i')
                return regex.test(title)
              })
              .slice(0, 10)
              .sort((a, b) => {
                return a.created_at > b.created_at ? -1 : 1
              })
              .map((d) => (
                <li key={d.document_id}>
                  <Button variant={'ghost'} asChild>
                    <Link
                      href={d.translations[0].url}
                      className='w-full text-start flex !justify-start gap-2 items-center'
                      target='_blank'
                      onClick={() => {
                        setSearchBarFocused(false)
                        setSearch('')
                      }}
                    >
                      {d.document_type === 'DOCUMENT' ? (
                        <DocumentIcon
                          className='w-5 h-5 text-green-500'
                          title='Document'
                        />
                      ) : (
                        <DocumentTextIcon
                          className='w-5 h-5 text-amber-500'
                          title='Document type is a Form'
                        />
                      )}
                      <p className='max-w-72 truncate'>
                        <span className='font-bold'>
                          {d.translations[0].title.slice(0, search.length)}
                        </span>
                        {d.translations[0].title.slice(search.length)}
                      </p>
                    </Link>
                  </Button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </form>
  )
}
