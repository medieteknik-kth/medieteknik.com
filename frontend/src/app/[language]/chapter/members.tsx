'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  CommitteePosition,
  CommitteePositionCategory,
} from '@/models/Committee'
import Image from 'next/image'
import Link from 'next/link'
import NLGIcon from 'public/images/committees/nlg.png'
import BG from 'public/images/kth-landskap.jpg'
import FallbackImage from 'public/images/logo.webp'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import useSWR from 'swr'
import { API_BASE_URL } from '@/utility/Constants'
import Student from '@/models/Student'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'

const fetcher = (url: string) =>
  fetch(url).then(
    (res) =>
      res.json() as Promise<
        {
          position: CommitteePosition
          student: Student
          initiation_date: string
          termination_date: string
        }[]
      >
  )

export default function CommitteeMembers({ language }: { language: string }) {
  const { data: members, error } = useSWR(
    `${API_BASE_URL}/public/students/committee_members?language=${language}`,
    fetcher
  )
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('2024-2025')

  if (error) {
    return <div>Failed to load</div>
  }

  if (!members) {
    return <></>
  }

  const categories: CommitteePositionCategory[] = [
    'STYRELSEN',
    'VALBEREDNINGEN',
    'STUDIENÄMNDEN',
    'NÄRINGSLIV OCH KOMMUNIKATION',
    'STUDIESOCIALT',
    'FANBORGEN',
  ]

  const memberCategories = categories.map((category) => {
    return {
      name: category,
      members: members.filter(
        (member) => member.position.category === category
      ),
    }
  })

  const hasImage = (member: any) => {
    return !!member.student.profile_picture_url
  }

  const dates = [
    {
      value: '2024-2025',
      label: '2024 - 2025',
    },
    {
      value: '2023-2024',
      label: '2023 - 2024',
    },
    {
      value: '2022-2023',
      label: '2022 - 2023',
    },
    {
      value: '2021-2022',
      label: '2021 - 2022',
    },
    {
      value: '2020-2021',
      label: '2020 - 2021',
    },
    {
      value: '2019-2020',
      label: '2019 - 2020',
    },
    {
      value: '2018-2019',
      label: '2018 - 2019',
    },
  ]

  return (
    <section className='px-20 mb-10'>
      <div className='w-1/2 flex items-center gap-4 border-b-2 border-yellow-400 pb-4 mb-4'>
        <h1 className='uppercase tracking-wider font-semibold text-4xl block'>
          Officials
        </h1>
        <Separator orientation='vertical' className='h-8 bg-yellow-400' />
        <div className='flex items-center'>
          <Label htmlFor='year' className='mr-2'>
            Year:
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id='year'
                variant={'outline'}
                name='year'
                role='combobox'
                aria-label='Select year'
                aria-expanded={open}
                className='w-72 justify-start'
              >
                {value
                  ? dates.find((item) => item.value === value)?.label
                  : 'Select year...'}
                <ChevronDownIcon className='ml-2 h-4 w-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandInput placeholder='Search year...' />
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {dates.map((date) => (
                      <CommandItem
                        key={date.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : date.value)
                          setOpen(false)
                        }}
                      >
                        {date.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className='w-full flex flex-col gap-4'>
        {categories.map((category, index) => (
          <div key={index}>
            <h2 className='text-3xl tracking-wide uppercase text-black dark:text-yellow-400'>
              {category}
            </h2>
            <div className='flex flex-wrap gap-4 mt-2'>
              {memberCategories
                .filter((member) => member.name === category)
                .map((member) =>
                  member.members
                    .filter(
                      (member) =>
                        new Date(member.initiation_date) <=
                          new Date(value.split('-')[0] + '-12-31') &&
                        (new Date(member.termination_date) >=
                          new Date(value.split('-')[1] + '-01-01') ||
                          !member.termination_date)
                    )
                    .sort((a, b) =>
                      a.position.email.localeCompare(b.position.email, language)
                    )
                    .map((member, index) => (
                      <div
                        key={index}
                        className='w-72 h-fit border rounded-md relative dark:bg-[#111] shadow-sm shadow-black/25 dark:shadow-white/25'
                      >
                        <div className='relative'>
                          <Image
                            src={
                              member.student.profile_picture_url ||
                              FallbackImage
                            }
                            alt='img'
                            width={286}
                            height={286}
                            className={`w-full aspect-square object-cover rounded-md mx-auto ${
                              !hasImage(member) &&
                              'p-8 bg-[#EEE] dark:bg-[#323232]'
                            }`}
                          />
                          <div className='w-full h-20 absolute bottom-0 from-white from-20% dark:from-[#111] bg-gradient-to-t' />
                        </div>
                        <div className='flex gap-2 items-center px-2 absolute top-4 bg-white dark:bg-[#111] border border-l-0 rounded-r-md shadow-sm shadow-black/25 dark:shadow-white/25'>
                          <Avatar className='w-6 h-6'>
                            <AvatarImage
                              src={member.position.committee_logo_url}
                              alt={`${member.position.translations[0].title} logo`}
                              width={24}
                              height={24}
                            />
                            <AvatarFallback>
                              <Image
                                src={FallbackImage.src}
                                alt='Fallback image'
                                width={24}
                                height={24}
                                className='bg-white'
                              />
                            </AvatarFallback>
                          </Avatar>
                          <p className='text-sm uppercase tracking-wider max-w-40 leading-4 py-0.5'>
                            {member.position.translations[0].title}
                          </p>
                        </div>
                        <div className='px-2 pb-2 h-24'>
                          <p className='text-xl max-h-14 overflow-hidden '>
                            {member.student.first_name +
                              ' ' +
                              member.student.last_name}
                          </p>
                          <Link
                            href={`mailto:${member.position.email}`}
                            className='text-sm text-neutral-700 hover:text-yellow-400 hover:underline underline-offset-4 dark:text-neutral-300 dark:hover:text-yellow-400'
                            title={`Mail to ${member.position.email}`}
                          >
                            {member.position.email}
                          </Link>
                        </div>
                      </div>
                    ))
                )}
            </div>
            <Separator className='mt-4 bg-yellow-400' />
          </div>
        ))}
      </div>
    </section>
  )
}
