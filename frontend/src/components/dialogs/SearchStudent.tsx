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
import { StudentPagination } from '@/models/Pagination'
import Student from '@/models/Student'
import { API_BASE_URL } from '@/utility/Constants'
import {
  CheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import useSWR from 'swr'
import { Skeleton } from '../ui/skeleton'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function render(
  students: Student[],
  onClickCallback: (student: Student) => void,
  selectedStudents: Student[],
  setSelectedStudents: Dispatch<SetStateAction<Student[]>>
) {
  return students.map((student, index) => (
    <li key={student.email + index} className='w-full flex justify-between'>
      <div className='max-w-[400px]'>
        <StudentTag key={index} student={student} includeAt={false} />
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

export default function SearchStudent({
  students,
  onClickCallback,
}: {
  students?: Student[]
  onClickCallback: (student: Student) => void
}) {
  const [pageIndex, setPageIndex] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])

  const { data, error, isLoading } = useSWR<StudentPagination>(
    `${API_BASE_URL}/public/students?page=${pageIndex}${
      searchQuery ? `&q=${searchQuery}` : ''
    }`,
    fetcher
  )

  if (students) {
    return (
      <ul className='flex flex-col gap-1 h-[440px] overflow-y-auto'>
        {render(
          students,
          onClickCallback,
          selectedStudents,
          setSelectedStudents
        )}
      </ul>
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
          <ul className='flex flex-col gap-1 h-[440px]'>
            {data.total_items === 0 && (
              <li className='text-center h-[440px]'>No students found</li>
            )}
            {render(
              data.items,
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
          <PaginationItem></PaginationItem>
          {[...Array(data.total_pages)].map((_, index) =>
            pageIndex + 2 === index || pageIndex - 2 === index ? (
              <PaginationEllipsis key={index} />
            ) : (
              pageIndex + 2 > index &&
              pageIndex - 2 < index && (
                <PaginationItem key={index}>
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
