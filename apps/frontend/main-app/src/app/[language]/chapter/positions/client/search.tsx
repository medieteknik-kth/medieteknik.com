'use client'

import PositionDisplay from '@/app/[language]/chapter/positions/positionDisplay'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { CommitteePosition } from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  type ChangeEvent,
  type JSX,
  useCallback,
  useMemo,
  useState,
} from 'react'

interface Props {
  language: LanguageCode
  data: CommitteePosition[]
}

/**
 * @name Search
 * @description Displays a search bar for positions
 *
 * @param {Props} props
 * @param {string} props.language - The current language
 * @param {CommitteePosition[]} props.data - The positions to search through
 *
 * @returns {JSX.Element} The search component
 */
export default function Search({ language, data }: Props): JSX.Element {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || ''
  )
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const { t } = useTranslation(language, 'positions')

  const updateSearchInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e) {
      return
    }
    setSearchInput(e.currentTarget.value)
  }, [])

  const updateSearch = useCallback(() => {
    if (searchInput.length < 3) {
      return
    }
    router.replace(`${pathname}?search=${searchInput.toLowerCase()}`)
    setSearch(searchInput)
  }, [searchInput, pathname, router.replace])

  const filteredData = useMemo(() => {
    return data.filter((position) =>
      position.translations[0].title
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [data, search])

  return (
    <section className='pt-8 px-2 sm:px-5 md:px-20'>
      <h2 className='text-xl pb-1'>{t('search')}</h2>
      <div className='flex gap-2 items-center relative'>
        <Input
          placeholder='Ordförande, vice ordförande, ledamot...'
          value={searchInput}
          onChange={updateSearchInput}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              updateSearch()
            }
          }}
        />
        <button
          type='button'
          className={`absolute right-14 ${
            searchInput.length < 1 && 'hidden'
          } p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md`}
          onClick={() => {
            setSearchInput('')
            setSearch('')
          }}
        >
          <XMarkIcon className='w-5 h-5' />
        </button>
        <Button
          size={'icon'}
          onClick={updateSearch}
          disabled={searchInput.length < 3}
          title={t('search')}
        >
          <MagnifyingGlassIcon className='w-5 h-5' />
        </Button>
      </div>
      <div className={`${!search ? 'hidden' : 'block'} py-2 h-fit pb-4`}>
        <p
          className='pb-1 text-neutral-500 dark:text-neutral-200'
          title={t('search.results')}
        >
          {t('search.results')}{' '}
          <span className='font-bold text-neutral-900 dark:text-neutral-100'>
            ({filteredData.length})
          </span>
        </p>
        <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {filteredData.map((position, index) => (
            <li key={`${position.committee_position_id}_search`}>
              <PositionDisplay position={position} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
