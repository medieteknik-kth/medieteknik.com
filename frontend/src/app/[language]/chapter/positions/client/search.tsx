'use client'

import PositionDisplay from '@/app/[language]/chapter/positions/positionDisplay'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CommitteePosition } from '@/models/Committee'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, useCallback, useState, type JSX } from 'react'

interface Props {
  language: string
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
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
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
    setSearch(searchInput)
  }, [searchInput])

  return (
    <section className='pt-8 px-16'>
      <h2 className='text-xl pb-1'>{t('search')}</h2>
      <div className='flex gap-2 items-center'>
        <Input
          placeholder='Ordförande, vice ordförande, ledamot...'
          value={searchInput}
          onChange={updateSearchInput}
        />
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
        <p className='pb-1 text-neutral-500 dark:text-neutral-200'>
          {t('search.results')}
        </p>
        <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {data
            .filter((position) =>
              position.translations[0].title
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((position, index) => (
              <li key={index}>
                <PositionDisplay language={language} position={position} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  )
}
