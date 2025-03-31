'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type Committee from '@/models/Committee'
import type { Category } from '@/models/Form'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  defaultValue?: Category[]
  setFormCategories: (categories: Category[]) => void
  categoryStep: number
  uncompleteStep: (step: number) => void
  completeStep: (step: number) => void
  committees: Committee[]
}

export default function Categorize({
  defaultValue,
  setFormCategories,
  categoryStep,
  uncompleteStep,
  completeStep,
  committees,
}: Props) {
  let categoryIndex = 0 // Used to generate unique IDs for categories
  const [dropdownOpen, setDropdownOpen] = useState(-1) // -1 = none, i = index of the dropdown open
  const [categories, setCategories] = useState<Category[]>([
    ...(defaultValue && defaultValue.length > 0
      ? defaultValue
      : [
          {
            id: 0,
            author: '',
            category: '',
            type: '',
            amount: '0',
          },
        ]),
  ])

  const allCommittees = [
    ...committees.map((committee) => ({
      value: committee.committee_id,
      label: committee.translations[0].title,
      icon: committee.logo_url,
    })),
  ]

  const addCategory = useCallback(() => {
    categoryIndex++
    setCategories((prev) => [
      ...prev,
      {
        id: categoryIndex,
        author: '',
        category: '',
        type: '',
        amount: '0',
      },
    ])
  }, [categoryIndex])

  const validateCategories = useCallback(() => {
    const isValid = categories.every(
      (category) =>
        category.author !== '' &&
        category.category !== '' &&
        category.type !== '' &&
        category.amount !== '' &&
        category.amount !== '0' &&
        (Number.isNaN(category.amount)
          ? false
          : Number.parseFloat(category.amount) > 0)
    )

    if (isValid) {
      completeStep(categoryStep)
    } else {
      uncompleteStep(categoryStep)
    }
  }, [categories, categoryStep, completeStep, uncompleteStep])

  // biome-ignore lint/correctness/useExhaustiveDependencies: Update categories and validateCategories
  useEffect(() => {
    validateCategories()
  }, [categories, validateCategories])

  useEffect(() => {
    setFormCategories(categories)
  }, [categories, setFormCategories])

  return (
    <>
      <ul className='space-y-2 mt-4'>
        {categories.map((category, index) => (
          <li
            key={category.id}
            className='flex md:grid grid-cols-12 md:gap-4 items-center gap-2 flex-wrap'
          >
            <div className='w-full flex flex-col gap-2 col-span-3'>
              {index === 0 && (
                <Label>
                  Author <span className='text-red-500'>*</span>
                </Label>
              )}
              <Popover
                open={dropdownOpen === index}
                onOpenChange={() => {
                  setDropdownOpen((prev) => (prev === index ? -1 : index))
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                    role='combobox'
                    className='w-full items-center justify-between'
                  >
                    <div className='flex items-center gap-2'>
                      <div className='bg-white p-1 rounded-lg'>
                        <Image
                          src={
                            allCommittees.find(
                              (committee) => committee.value === category.author
                            )?.icon || Logo.src
                          }
                          alt='Committee'
                          unoptimized
                          width={24}
                          height={24}
                        />
                      </div>
                      {allCommittees.find(
                        (committee) => committee.value === category.author
                      )?.label || 'Select a committee'}
                    </div>
                    <ChevronDownIcon className='w-5 h-5' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-96! p-0'>
                  <Command>
                    <CommandInput placeholder='Search' />
                    <CommandList>
                      <CommandEmpty>'None found</CommandEmpty>
                      <CommandGroup>
                        {allCommittees.map((committee) => (
                          <CommandItem
                            key={committee.value}
                            value={committee.value}
                            onSelect={(currentValue) => {
                              const newCategories = [...categories]
                              newCategories[index].author = currentValue
                              setDropdownOpen(-1)
                              validateCategories()
                            }}
                            className='flex items-center justify-between'
                          >
                            <div className='flex items-center gap-2'>
                              <div className='bg-white p-1 rounded-lg'>
                                <Image
                                  src={committee.icon}
                                  alt={committee.label}
                                  unoptimized
                                  width={24}
                                  height={24}
                                />
                              </div>
                              {committee.label}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className='w-full flex flex-col gap-2 col-span-3'>
              {index === 0 && (
                <Label>
                  Category <span className='text-red-500'>*</span>
                </Label>
              )}
              <Input
                type='text'
                placeholder='Category'
                value={category.category}
                onChange={(e) => {
                  const newCategories = [...categories]
                  newCategories[index].category = e.target.value
                  setCategories(newCategories)
                }}
              />
            </div>

            <div className='w-full flex flex-col gap-2 col-span-3'>
              {index === 0 && (
                <Label>
                  Type <span className='text-red-500'>*</span>
                </Label>
              )}

              <Input
                type='text'
                placeholder='Type'
                value={category.type}
                onChange={(e) => {
                  const newCategories = [...categories]
                  newCategories[index].type = e.target.value
                  setCategories(newCategories)
                }}
              />
            </div>

            <div className='w-full flex flex-col gap-2 col-span-2'>
              {index === 0 && (
                <Label>
                  Amount (SEK) <span className='text-red-500'>*</span>
                </Label>
              )}
              <Input
                type='text'
                placeholder='Amount'
                pattern='[0-9]*([.,][0-9]*)?'
                inputMode='numeric'
                value={category.amount}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^[0-9]*([.,][0-9]*)?$/.test(value)) {
                    // Only allow one comma or dot
                    if (
                      (value.match(/[,]/g) || []).length > 1 ||
                      (value.match(/[.]/g) || []).length > 1
                    ) {
                      return
                    }

                    const newCategories = [...categories]
                    newCategories[index].amount = value
                    setCategories(newCategories)
                  }
                }}
              />
            </div>

            <Button
              className='col-span-1 mt-auto'
              variant={'destructive'}
              size={'icon'}
              disabled={categories.length === 1 && index === 0}
              onClick={() => {
                const newCategories = [...categories]
                newCategories.splice(index, 1)
                setCategories(newCategories)
              }}
            >
              <XMarkIcon className='w-4 h-4' />
            </Button>
          </li>
        ))}
      </ul>
      <Button
        className='mt-4'
        variant={'outline'}
        size={'sm'}
        onClick={addCategory}
      >
        Add Category
      </Button>
    </>
  )
}
