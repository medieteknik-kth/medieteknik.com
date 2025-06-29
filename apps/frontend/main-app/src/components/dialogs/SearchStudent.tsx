'use client'

import StudentTag from '@/components/tags/StudentTag'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import type { LanguageCode } from '@/models/Language'
import type { StudentPagination } from '@/models/Pagination'
import type Student from '@/models/Student'
import {
  CheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { type Dispatch, type SetStateAction, useRef, useState } from 'react'
import useSWR from 'swr'
import { Skeleton } from '../ui/skeleton'

type OnlyStudents = {
  students?: Student[]
  metadata: never
}
type OnlyMetadata = {
  students?: never
  metadata: { student: Student; metadataKey: string }[]
}
type EitherStudentsOrMetadata = OnlyStudents | OnlyMetadata

function isStudents(
  studentsOrMetadata: EitherStudentsOrMetadata
): studentsOrMetadata is OnlyStudents {
  return 'students' in studentsOrMetadata
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Props {
  language: LanguageCode
  studentsOrMetadata?: EitherStudentsOrMetadata
  onClickCallback: (student: Student) => void
}

function render(
  students: Student[],
  language: LanguageCode,
  onClickCallback: (student: Student) => void,
  selectedStudents: Student[],
  setSelectedStudents: Dispatch<SetStateAction<Student[]>>
) {
  return students
    .sort((a, b) => {
      if (!a.email || !b.email) return -1
      return a.email.localeCompare(b.email)
    })
    .map((student) => (
      <li key={student.email} className='w-full flex justify-between'>
        <div className='max-w-[400px]'>
          <StudentTag student={student} language={language} includeAt={false} />
        </div>
        <Button
          size={'icon'}
          variant={'outline'}
          onClick={() => {
            onClickCallback(student)
            setSelectedStudents((prev) =>
              prev.includes(student)
                ? prev.filter((prevStudent) => prevStudent !== student)
                : [...prev, student]
            )
          }}
        >
          {selectedStudents.includes(student) ? (
            <CheckIcon className='h-5 w-5 text-green-500' />
          ) : (
            <PlusIcon className='h-5 w-5' />
          )}
        </Button>
      </li>
    ))
}

function renderMetadata(
  metadata: {
    student: Student
    metadataKey: string
  }[],
  language: LanguageCode,
  onClickCallback: (student: Student) => void,
  selectedStudents: Student[],
  setSelectedStudents: Dispatch<SetStateAction<Student[]>>
) {
  return metadata
    .sort((a, b) => {
      if (!a.student.email || !b.student.email) return -1
      return a.student.email.localeCompare(b.student.email)
    })
    .map((metadata) => (
      <li
        key={metadata.student.email + metadata.metadataKey}
        className='w-full flex justify-between'
      >
        <div className='max-w-[400px]'>
          <StudentTag
            student={metadata.student}
            language={language}
            includeAt={false}
          >
            <span className='text-xs text-muted-foreground'>
              {metadata.metadataKey}
            </span>
          </StudentTag>
        </div>
        <Button
          size={'icon'}
          variant={'outline'}
          onClick={() => {
            onClickCallback(metadata.student)
            setSelectedStudents((prev) =>
              prev.includes(metadata.student)
                ? prev.filter((prevStudent) => prevStudent !== metadata.student)
                : [...prev, metadata.student]
            )
          }}
        >
          {selectedStudents.includes(metadata.student) ? (
            <CheckIcon className='h-5 w-5 text-green-500' />
          ) : (
            <PlusIcon className='h-5 w-5' />
          )}
        </Button>
      </li>
    ))
}

export default function SearchStudent({
  language,
  studentsOrMetadata,
  onClickCallback,
}: Props) {
  const [pageIndex, setPageIndex] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])

  const { data, error, isLoading } = useSWR<StudentPagination>(
    `/api/public/students?page=${pageIndex}${
      searchQuery ? `&q=${searchQuery}` : ''
    }`,
    fetcher
  )
  if (studentsOrMetadata) {
    if (isStudents(studentsOrMetadata)) {
      return (
        <ul className='flex flex-col gap-1 h-[440px] overflow-y-auto'>
          {render(
            studentsOrMetadata.students || [],
            language,
            onClickCallback,
            selectedStudents,
            setSelectedStudents
          )}
        </ul>
      )
    }

    if (!isStudents(studentsOrMetadata)) {
      return (
        <ul className='flex flex-col gap-1 h-[440px] overflow-y-auto'>
          {renderMetadata(
            studentsOrMetadata.metadata,
            language,
            onClickCallback,
            selectedStudents,
            setSelectedStudents
          )}
        </ul>
      )
    }
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
        <Label htmlFor='search'>Search Student Name</Label>
        <div className='flex gap-2'>
          <Input
            placeholder='Search...'
            type='search'
            name='search'
            id='search'
            className='w-fit grow'
            ref={searchRef}
            pattern='[a-zA-Z\@\.]+'
            title='Only letters, @, and periods are allowed i.e. a-z, A-Z, @, .'
          />
          <Button size={'icon'} type='submit'>
            <MagnifyingGlassIcon className='h-5 w-5' />
          </Button>
        </div>
      </form>
      <div>
        {isLoading ? (
          <Skeleton className='w-full h-[440px]' />
        ) : error ? (
          <div className='h-[440px]'>Error</div>
        ) : (
          <ul className='grid grid-rows-10'>
            {data.total_items === 0 && (
              <li className='text-center h-[440px]'>No students found</li>
            )}
            {render(
              data.items,
              language,
              onClickCallback,
              selectedStudents,
              setSelectedStudents
            )}
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
              {'< '}Previous
            </Button>
          </PaginationItem>
          {Array.from({ length: data.total_pages }, (_, index) => index).map(
            (page, index) =>
              pageIndex + 2 === index || pageIndex - 2 === index ? (
                <PaginationEllipsis key={`ellipsis-${page}`} />
              ) : (
                pageIndex + 2 > index &&
                pageIndex - 2 < index && (
                  <PaginationItem key={page}>
                    <Button
                      disabled={pageIndex === index + 1}
                      onClick={() => setPageIndex(index + 1)}
                      variant={'ghost'}
                    >
                      <span>{index + 1}</span>
                    </Button>
                  </PaginationItem>
                )
              )
          )}

          <PaginationItem>
            <Button
              disabled={pageIndex === data.total_pages}
              onClick={() => setPageIndex((prev) => prev + 1)}
              variant={'ghost'}
            >
              Next {' >'}
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
