'use client'

import { type SearchResponse, getSearchEntries } from '@/api/search'
import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MultiSelect } from '@/components/ui/multi-select'
import type { LanguageCode } from '@/models/Language'
import {
  getIndexedDBSearchEntry,
  getIndexedDBTimestamp,
  setIndexedDBSearchEntries,
} from '@/utility/IndexedDB'
import {
  ClipboardDocumentListIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  language: LanguageCode
  cachedSearchEntries: SearchResponse | null
}

export default function ContextSearch({
  language,
  cachedSearchEntries,
}: Props) {
  // WARNING: This can be a performance bottleneck if the data is large
  const [searchEntries, updateSearchEntries] = useState(cachedSearchEntries)
  const [openDialog, setOpenDialog] = useState(false)
  const [isContentDisplayed, setContentVisibility] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([
    'committee',
    'committee_position',
  ])
  const [entriesFromClient, setEntriesFromClient] = useState<boolean>(false)
  const { t } = useTranslation(language, 'header/context_search')

  const isFilters = [
    { value: 'committee', label: t('committees') },
    { value: 'committee_position', label: t('committee_positions') },
    { value: 'document', label: t('documents') },
    { value: 'media', label: t('media') },
    { value: 'news', label: t('news') },
  ]

  useEffect(() => {
    async function getData() {
      const previousData = await getIndexedDBSearchEntry(language)
      if (previousData) {
        const updated_at = await getIndexedDBTimestamp(language)
        if (updated_at) {
          // If the data is older than 24 hours, update it
          const now = new Date()
          const updatedAt = new Date(updated_at)
          const diff = now.getTime() - updatedAt.getTime()
          const diffHours = Math.floor(diff / (1000 * 60 * 60))

          if (diffHours > 24 || Object.keys(previousData).length === 0) {
            const { data: newData, error: searchError } =
              await getSearchEntries(language, 0)

            if (newData) {
              await setIndexedDBSearchEntries(language, newData)
              updateSearchEntries(newData)
            }

            if (searchError) {
              console.error('Error fetching search entries:', searchError)
              updateSearchEntries(previousData)
              setEntriesFromClient(true)
            }
          } else {
            // If the data is less than 24 hours old, use it
            updateSearchEntries(previousData)
            setEntriesFromClient(true)
          }
        }
      } else {
        // If there is no data in IndexedDB, fetch it from the API
        const { data: newData } = await getSearchEntries(language, 0)
        if (newData) {
          await setIndexedDBSearchEntries(language, newData)
          updateSearchEntries(newData)
        }
      }
    }
    getData()
  }, [language])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenDialog(!openDialog)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [openDialog])

  const valuesDontExist =
    !searchEntries ||
    !searchEntries?.albums ||
    !searchEntries?.committee_positions ||
    !searchEntries?.committees ||
    !searchEntries?.documents ||
    !searchEntries?.media ||
    !searchEntries?.news

  const suggestions = useMemo(
    () =>
      !valuesDontExist
        ? [
            {
              category: 'committees',
              data: searchEntries.committees[
                Math.floor(
                  Math.random() * searchEntries.committees?.length || 0
                )
              ],
            },
            {
              category: 'media',
              data: searchEntries.media[
                Math.floor(Math.random() * searchEntries.media.length)
              ],
            },
            {
              category: 'documents',
              data: searchEntries.documents[
                Math.floor(Math.random() * searchEntries.documents.length)
              ],
            },
            {
              category: 'news',
              data: searchEntries.news[
                Math.floor(Math.random() * searchEntries.news.length)
              ],
            },
            {
              category: 'committee_positions',
              data: searchEntries.committee_positions[
                Math.floor(
                  Math.random() * searchEntries.committee_positions.length
                )
              ],
            },
          ]
        : [],
    [
      searchEntries,
      searchEntries?.committees,
      searchEntries?.media,
      searchEntries?.documents,
      searchEntries?.news,
      searchEntries?.committee_positions,
      valuesDontExist,
    ]
  )

  if (entriesFromClient && valuesDontExist) {
    console.error('Search entries are not defined')
    return <></>
  }

  if (valuesDontExist) {
    return <></>
  }

  return (
    <>
      <Button
        variant={'defaultOutline'}
        size={'icon'}
        className='rounded-full md:rounded-xl overflow-hidden h-[4.5rem] md:h-6 w-[4.5rem] md:w-fit flex items-center md:gap-0.5 md:px-2 md:opacity-60 hover:opacity-100 transition-opacity duration-500 ease-in-out'
        title={t('title')}
        aria-label='Search Button'
        onClick={() => setOpenDialog(!openDialog)}
      >
        <MagnifyingGlassIcon className='w-7 md:w-4 h-7 md:h-4' />
        <span className='select-none'>
          <kbd className='hidden md:inline-flex font-medium text-xs'>
            {navigator.userAgent.toLowerCase().indexOf('mac') > -1
              ? '⌘K'
              : 'Ctrl+K'}
          </kbd>
        </span>
      </Button>
      {openDialog && (
        <CommandDialog
          open={openDialog}
          onOpenChange={() => {
            setOpenDialog(false)
            setContentVisibility(false)
          }}
        >
          <div className='p-6'>
            <DialogHeader>
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription>{t('description')}</DialogDescription>
              <CommandInput
                placeholder={t('placeholder')}
                className='h-14'
                onInput={(e) => {
                  const value = (e.target as HTMLInputElement).value
                  if (value.length > 3) {
                    setContentVisibility(true)
                  } else {
                    setContentVisibility(false)
                  }
                }}
              />
              <div className='pb-2'>
                <MultiSelect
                  options={isFilters}
                  onValueChange={setActiveFilters}
                  defaultValue={activeFilters}
                  placeholder={t('placeholder_filters')}
                  maxCount={2}
                  text={{
                    clear: t('clear'),
                    close: t('close'),
                    more: t('more'),
                    no_results: t('no_results'),
                    search: t('search'),
                    select_all: t('select_all'),
                  }}
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  {t('filter_hint')}
                </p>
              </div>
            </DialogHeader>
            {!valuesDontExist && (
              <CommandList>
                <CommandEmpty
                  className={`${isContentDisplayed ? 'flex text-center flex-col' : 'hidden'}`}
                >
                  {t('no_results')}
                  <span className='text-xs text-muted-foreground mt-1'>
                    {t('no_results_hint')}
                  </span>
                </CommandEmpty>

                {/* Suggestions */}
                {!isContentDisplayed ? (
                  <CommandGroup
                    heading={t('suggestions')}
                    forceMount={!isContentDisplayed}
                    className='p-0! *:px-0!'
                  >
                    {suggestions
                      .sort(() => 0.5 - Math.random())
                      .filter((suggestion) => {
                        if (!suggestion.data) return false
                        return true
                      })
                      .slice(0, 3)
                      .map((suggestion) => {
                        const { category, data } = suggestion

                        switch (category) {
                          case 'committees':
                            return (
                              <CommandItem
                                key={`suggestion-${data.translation.title}`}
                                asChild
                              >
                                <Link
                                  href={`/${language}/chapter/committees/${data.translation.title.toLowerCase()}`}
                                  onClick={() => {
                                    setOpenDialog(false)
                                    setContentVisibility(false)
                                  }}
                                  className='px-2 py-1.5 cursor-pointer flex items-center gap-2'
                                >
                                  {'logo_url' in data && (
                                    <div className='bg-white rounded-lg p-1 overflow-hidden'>
                                      <Image
                                        src={data.logo_url}
                                        alt={data.translation.title}
                                        width={20}
                                        height={20}
                                        unoptimized
                                        className='h-5 w-5'
                                      />
                                    </div>
                                  )}
                                  <div className='flex flex-col'>
                                    {data.translation.title}
                                    <span className='text-xs text-muted-foreground'>
                                      {t('committees')}
                                    </span>
                                  </div>
                                </Link>
                              </CommandItem>
                            )

                          case 'committee_positions':
                            return (
                              <CommandItem
                                key={`suggestion-${data.translation.title}`}
                                asChild
                              >
                                <Link
                                  href={`/${language}/chapter/positions?search=${data.translation.title.toLowerCase()}#position-${'email' in data ? data.email : ''}`}
                                  onClick={() => {
                                    setOpenDialog(false)
                                    setContentVisibility(false)
                                  }}
                                  className='px-2 py-1.5 cursor-pointer flex items-center gap-2'
                                >
                                  {'committee' in data && data.committee && (
                                    <div className='bg-white p-1 rounded-lg overflow-hidden'>
                                      <Image
                                        src={data.committee.logo_url}
                                        alt={data.committee.title}
                                        width={20}
                                        height={20}
                                        unoptimized
                                        className='h-5 w-5'
                                      />
                                    </div>
                                  )}
                                  <div className='flex flex-col'>
                                    {data.translation.title}
                                    <span className='text-xs text-muted-foreground'>
                                      {t('committee_position')}
                                    </span>
                                  </div>
                                </Link>
                              </CommandItem>
                            )

                          case 'documents':
                            return (
                              <CommandItem
                                key={`suggestion-${data.translation.title}`}
                                asChild
                              >
                                <Link
                                  href={
                                    ('url' in data.translation &&
                                      data.translation.url) ||
                                    ''
                                  }
                                  onClick={() => {
                                    setOpenDialog(false)
                                    setContentVisibility(false)
                                  }}
                                  className='px-2 py-1.5 cursor-pointer flex items-center gap-2'
                                  target='_blank'
                                >
                                  <div className='bg-white p-1 overflow-hidden text-black rounded-lg'>
                                    <DocumentIcon className='h-5 w-5' />
                                  </div>
                                  <div className='flex flex-col'>
                                    {data.translation.title}
                                    <span className='text-xs text-muted-foreground'>
                                      {t('documents')}
                                    </span>
                                  </div>
                                </Link>
                              </CommandItem>
                            )

                          case 'media':
                            return (
                              <CommandItem
                                key={`suggestion-${data.translation.title}`}
                                asChild
                              >
                                <Link
                                  href={`/${language}/chapter/media/${data.translation.title.toLowerCase()}`}
                                  onClick={() => {
                                    setOpenDialog(false)
                                    setContentVisibility(false)
                                  }}
                                  className='px-2 py-1.5 cursor-pointer flex items-center gap-2'
                                >
                                  <div className='bg-white p-1 rounded-lg overflow-hidden text-black'>
                                    <PhotoIcon className='h-5 w-5' />
                                  </div>
                                  <div className='flex flex-col'>
                                    {data.translation.title}
                                    <span className='text-xs text-muted-foreground'>
                                      {t('media')}
                                    </span>
                                  </div>
                                </Link>
                              </CommandItem>
                            )

                          case 'news':
                            return (
                              <CommandItem
                                key={`suggestion-${data.translation.title}`}
                                asChild
                              >
                                <Link
                                  href={
                                    'url' in data
                                      ? `/${language}/bulletin/news/${data.url}`
                                      : ''
                                  }
                                  onClick={() => {
                                    setOpenDialog(false)
                                    setContentVisibility(false)
                                  }}
                                  className='px-2 py-1.5 cursor-pointer flex items-center gap-2'
                                >
                                  <div className='bg-white p-1 overflow-hidden rounded-lg text-black'>
                                    {'main_image_url' in data.translation &&
                                    data.translation.main_image_url ? (
                                      <Image
                                        src={data.translation.main_image_url}
                                        alt={data.translation.title}
                                        width={20}
                                        height={20}
                                        unoptimized
                                        className='h-5 w-5'
                                      />
                                    ) : (
                                      <ClipboardDocumentListIcon className='h-5 w-5' />
                                    )}
                                  </div>
                                  <div className='flex flex-col'>
                                    {data.translation.title}
                                    <span className='text-xs text-muted-foreground'>
                                      {t('news')}
                                    </span>
                                  </div>
                                </Link>
                              </CommandItem>
                            )

                          default:
                            return null
                        }
                      })}
                  </CommandGroup>
                ) : (
                  <>
                    {/* Search Results */}

                    {activeFilters.includes('committee') && (
                      <CommandGroup heading={t('committees')} className='p-0!'>
                        {searchEntries.committees.map((committee) => (
                          <CommandItem
                            key={committee.translation.title}
                            className='gap-2'
                            value={committee.translation.title}
                            asChild
                          >
                            <Link
                              href={`/${language}/chapter/committees/${committee.translation.title.toLocaleLowerCase()}`}
                              onClick={() => {
                                setOpenDialog(false)
                                setContentVisibility(false)
                              }}
                              className='px-2 py-1.5 cursor-pointer'
                            >
                              <div className='bg-white rounded-lg p-1 overflow-hidden'>
                                <Image
                                  src={committee.logo_url}
                                  alt={committee.translation.title}
                                  width={20}
                                  height={20}
                                  unoptimized
                                  className='h-5 w-5'
                                />
                              </div>
                              <div className='flex flex-col'>
                                {committee.translation.title}
                                <span className='text-xs text-muted-foreground'>
                                  {committee.email}
                                </span>
                              </div>
                            </Link>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {activeFilters.includes('committee_position') && (
                      <CommandGroup
                        heading={t('committee_positions')}
                        className='p-0!'
                      >
                        {searchEntries.committee_positions.map(
                          (committee_position) => (
                            <CommandItem
                              key={committee_position.translation.title}
                              className='gap-2'
                              value={`${committee_position.translation.title} ${committee_position.committee?.title}`}
                              asChild
                            >
                              <Link
                                href={`/${language}/chapter/positions?search=${committee_position.email}#position-${committee_position.email}`}
                                onClick={() => {
                                  setOpenDialog(false)
                                  setContentVisibility(false)
                                }}
                                className='px-2 py-1.5 cursor-pointer'
                              >
                                {committee_position.committee && (
                                  <div className='bg-white rounded-lg p-1 overflow-hidden'>
                                    <Image
                                      src={
                                        committee_position.committee.logo_url
                                      }
                                      alt={committee_position.committee.title}
                                      width={20}
                                      height={20}
                                      unoptimized
                                      className='h-5 w-5'
                                    />
                                  </div>
                                )}
                                <div className='flex flex-col'>
                                  {committee_position.translation.title}
                                  <span className='text-xs text-muted-foreground'>
                                    {committee_position.email}
                                  </span>
                                </div>
                              </Link>
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    )}

                    {activeFilters.includes('document') && (
                      <CommandGroup heading={t('documents')} className='p-0!'>
                        <div className='flex flex-col'>
                          {searchEntries.documents.map((document) => (
                            <CommandItem
                              key={document.translation.title}
                              className='gap-2'
                              value={`${document.translation.title} ${document.author.email}`}
                              asChild
                            >
                              <Link
                                href={document.translation.url}
                                onClick={() => {
                                  setOpenDialog(false)
                                  setContentVisibility(false)
                                }}
                                className='px-2 py-1.5 cursor-pointer'
                                target='_blank'
                              >
                                <div className='bg-white rounded-lg p-1 overflow-hidden text-black'>
                                  <DocumentIcon className='h-5 w-5' />
                                </div>
                                {document.translation.title}
                              </Link>
                            </CommandItem>
                          ))}
                        </div>
                      </CommandGroup>
                    )}

                    {activeFilters.includes('media') && (
                      <CommandGroup heading={t('media')} className='p-0!'>
                        {searchEntries.albums.map((album) => (
                          <CommandItem
                            key={album.translation.title}
                            className='gap-2'
                            value={album.translation.title}
                            asChild
                          >
                            <Link
                              href={`/${language}/chapter/media/${album.translation.title.toLowerCase()}`}
                              onClick={() => {
                                setOpenDialog(false)
                                setContentVisibility(false)
                              }}
                              className='px-2 py-1.5 cursor-pointer'
                            >
                              <div className='bg-white rounded-lg p-1 overflow-hidden text-black'>
                                <PhotoIcon className='h-5 w-5' />
                              </div>
                              {album.translation.title}
                            </Link>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {activeFilters.includes('news') && (
                      <CommandGroup heading={t('news')} className='p-0!'>
                        {searchEntries.news.map((news) => (
                          <CommandItem
                            key={news.translation.title}
                            className='gap-2'
                            value={news.translation.title}
                            asChild
                          >
                            <Link
                              href={`/${language}/bulletin/news/${news.url}`}
                              onClick={() => {
                                setOpenDialog(false)
                                setContentVisibility(false)
                              }}
                              className='px-2 py-1.5 cursor-pointer'
                              target='_blank'
                            >
                              <div className='bg-white rounded-lg p-1 overflow-hidden text-black'>
                                {'main_image_url' in news.translation &&
                                news.translation.main_image_url ? (
                                  <Image
                                    src={news.translation.main_image_url}
                                    alt={news.translation.title}
                                    width={20}
                                    height={20}
                                    unoptimized
                                    className='h-5 w-5'
                                  />
                                ) : (
                                  <ClipboardDocumentListIcon className='h-5 w-5' />
                                )}
                              </div>
                              {news.translation.title}
                            </Link>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </>
                )}
              </CommandList>
            )}
          </div>
        </CommandDialog>
      )}
    </>
  )
}
