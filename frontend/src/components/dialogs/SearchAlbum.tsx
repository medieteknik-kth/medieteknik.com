'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Album from '@/models/Album'
import { AlbumPagination } from '@/models/Pagination'
import { API_BASE_URL } from '@/utility/Constants'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { Skeleton } from '../ui/skeleton'
import { LanguageCode } from '@/models/Language'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Props {
  language: LanguageCode
  albums?: Album[]
  callback: (album: Album | null) => void
}

export default function SearchAlbum({ language, albums, callback }: Props) {
  const [pageIndex, setPageIndex] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation(language, 'media')

  const { data, error, isLoading } = useSWR<AlbumPagination>(
    `${API_BASE_URL}/public/albums?page=${pageIndex}${
      searchQuery ? `&q=${searchQuery}` : ''
    }`,
    fetcher
  )

  if (albums) {
    return (
      <RadioGroup>
        {albums.map((album) => (
          <div key={album.album_id} className='flex gap-2 items-center'>
            <RadioGroupItem
              value={album.album_id}
              onClick={() => callback(album)}
              id={album.album_id}
            />
            <Label htmlFor={album.album_id}>
              {album.translations[0].title}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  }

  if (!data) {
    return <Skeleton />
  }

  return (
    <>
      <form
        className='flex flex-col gap-1'
        onSubmit={(event) => {
          event.preventDefault()
          if (!searchRef.current) return
          if (searchRef.current) searchRef.current.blur()
          setPageIndex(1)
          setSearchQuery(searchRef.current.value || '')
        }}
      >
        <div className='flex flex-col my-2'>
          <p className='text-sm'>{t('select_album.none')}</p>
          <Button onClick={() => callback(null)} type='button'>
            {t('select_album.none_button')}
          </Button>
        </div>
        <Label htmlFor='search'>{t('search_album')}</Label>
        <div className='flex gap-2'>
          <Input
            placeholder={t('search_album') + '...'}
            type='search'
            name='search'
            id='search'
            className='w-fit grow'
            ref={searchRef}
            pattern='[a-zA-Z0-9]+'
            title='Only letters and numbers are allowed i.e. a-z, A-Z, 0-9'
          />
          <Button size={'icon'} type='submit'>
            <MagnifyingGlassIcon className='h-5 w-5' />
          </Button>
        </div>
      </form>
      <div>
        {isLoading ? (
          <Skeleton />
        ) : error ? (
          <div>Error</div>
        ) : (
          <ul className='flex flex-col gap-1 h-[160px]'>
            {data.total_items === 0 && (
              <li className='text-center'>{t('search_album.none')}</li>
            )}
            <RadioGroup>
              {data.items.map((album) => (
                <li key={album.album_id} className='flex gap-2 items-center'>
                  <RadioGroupItem
                    value={album.album_id}
                    onClick={() => callback(album)}
                    id={album.album_id}
                  />
                  <Label htmlFor={album.album_id}>
                    {album.translations[0].title}
                  </Label>
                </li>
              ))}
            </RadioGroup>
          </ul>
        )}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              disabled={pageIndex === 1}
              onClick={() => setPageIndex((prev) => prev - 1)}
              variant={'ghost'}
            >
              {'< '}
              {t('previous')}
            </Button>
          </PaginationItem>
          {[...Array(data.total_pages)].map((_, index) => (
            <PaginationItem key={index}>
              <Button
                disabled={pageIndex === index + 1}
                onClick={() => setPageIndex(index + 1)}
                variant={'ghost'}
              >
                <span>{index + 1}</span>
              </Button>
            </PaginationItem>
          ))}
          {pageIndex + 3 < data.total_pages && <PaginationEllipsis />}
          <PaginationItem>
            <Button
              disabled={pageIndex === data.total_pages}
              onClick={() => setPageIndex((prev) => prev + 1)}
              variant={'ghost'}
            >
              {t('next')} {' >'}
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
