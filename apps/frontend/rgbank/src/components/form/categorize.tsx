'use client'

import { useTranslation } from '@/app/i18n/client'
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
import type { ExpenseDomain } from '@/models/ExpenseDomain'
import type { Category } from '@/models/Form'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { Committee } from '@medieteknik/models'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
  defaultValue?: Category[]
  expenseDomains: ExpenseDomain[]
  setFormCategories: (categories: Category[]) => void
  categoryStep: number
  uncompleteStep: (step: number) => void
  completeStep: (step: number) => void
  committees: Committee[]
}

export default function Categorize({
  language,
  defaultValue,
  expenseDomains,
  setFormCategories,
  categoryStep,
  uncompleteStep,
  completeStep,
  committees,
}: Props) {
  let categoryIndex = 0
  const [dropdownOpen, setDropdownOpen] = useState(-1) // -1 = none, i = index of the dropdown open
  const [partDropdownOpen, setPartDropdownOpen] = useState(-1) // -1 = none, i = index of the dropdown open
  const [categories, setCategories] = useState<Category[]>([
    ...(defaultValue && defaultValue.length > 0
      ? defaultValue
      : [
          {
            id: 0,
            author: '',
            category: '',
            amount: '0',
          },
        ]),
  ])
  const { t } = useTranslation(language, 'upload/categorize')
  const allDomains = expenseDomains.map((domain) => {
    return {
      label: domain.title,
      value: domain.expense_part_id,
      icon: committees.find(
        (committee) => committee.committee_id === domain.committee_id
      )?.logo_url,
    }
  })

  const addCategory = useCallback(() => {
    categoryIndex++
    setCategories((prev) => [
      ...prev,
      {
        id: categoryIndex,
        author: categories[0].author,
        category: '',
        amount: '0',
      },
    ])
  }, [categoryIndex, categories])

  const validateCategories = useCallback(() => {
    const isValid = categories.every(
      (category) =>
        category.author !== '' &&
        category.category !== '' &&
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
            className='w-full flex xl:grid grid-cols-12 md:gap-4 items-center gap-2 flex-wrap'
          >
            <div className='grow flex flex-col gap-2 col-span-4'>
              {index === 0 && (
                <Label id='domains' htmlFor='domains'>
                  {t('domain')} <span className='text-red-500'>*</span>
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
                    id={`domain-${index}`}
                    name={`domain-${index}`}
                    title={`${t('domain')} ${index + 1}`}
                    variant={'outline'}
                    // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                    disabled={index !== 0}
                    role='combobox'
                    className='w-full items-center justify-between'
                    aria-expanded={dropdownOpen === index}
                    aria-labelledby='domains'
                  >
                    <span className='sr-only'>
                      {`${t('domain')} ${index + 1}`}
                    </span>
                    <div className='flex items-center gap-2'>
                      <div className='bg-white p-1 rounded-lg'>
                        <Image
                          src={
                            allDomains.find(
                              (domain) => domain.label === category.author
                            )?.icon || Logo.src
                          }
                          alt='Committee'
                          unoptimized
                          width={24}
                          height={24}
                        />
                      </div>
                      {allDomains.find(
                        (domain) => domain.label === category.author
                      )?.label || t('domain.select')}
                    </div>
                    <ChevronDownIcon className='w-5 h-5' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-96! p-0'>
                  <Command>
                    <CommandInput
                      placeholder={t('domain.search.placeholder')}
                      title={t('domain.search.placeholder')}
                    />
                    <CommandList>
                      <CommandEmpty>{t('domain.noneFound')}</CommandEmpty>
                      <CommandGroup>
                        {allDomains.map((domain) => (
                          <CommandItem
                            key={domain.value}
                            value={domain.label}
                            onSelect={(currentValue) => {
                              const newCategories = [...categories]
                              newCategories[index].author = currentValue
                              setDropdownOpen(-1)
                              setCategories([
                                {
                                  id: index,
                                  author: currentValue,
                                  amount: '0',
                                  category: '',
                                },
                              ])

                              validateCategories()
                            }}
                            className='flex items-center justify-between'
                          >
                            <div className='flex items-center gap-2'>
                              {domain.icon && (
                                <div className='bg-white p-1 rounded-lg'>
                                  <Image
                                    src={domain.icon}
                                    alt={domain.label}
                                    unoptimized
                                    width={24}
                                    height={24}
                                  />
                                </div>
                              )}
                              {domain.label}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className='grow flex flex-col gap-2 col-span-4'>
              {index === 0 && (
                <Label id='categories' htmlFor='categories'>
                  {t('category')} <span className='text-red-500'>*</span>
                </Label>
              )}
              <Popover
                open={partDropdownOpen === index}
                onOpenChange={() => {
                  setPartDropdownOpen((prev) => (prev === index ? -1 : index))
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    id={`category-${index}`}
                    name={`category-${index}`}
                    title={`${t('category')} ${index + 1}`}
                    variant={'outline'}
                    // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                    role='combobox'
                    className='grow items-center justify-between'
                    aria-expanded={partDropdownOpen === index}
                    aria-labelledby='categories'
                  >
                    <span className='sr-only'>
                      {`${t('category')} ${index + 1}`}
                    </span>
                    <div className='flex items-center gap-2 max-w-64 2xl:max-w-max'>
                      <div className='bg-white p-1 rounded-lg'>
                        <Image
                          src={
                            allDomains.find(
                              (domain) => domain.label === category.author
                            )?.icon || Logo.src
                          }
                          alt='Committee'
                          unoptimized
                          width={24}
                          height={24}
                        />
                      </div>
                      <p className='truncate'>
                        {category.category || t('category.select')}
                      </p>
                    </div>
                    <ChevronDownIcon className='w-5 h-5' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-96! p-0'>
                  <Command>
                    <CommandInput
                      placeholder={t('category.search.placeholder')}
                      title={t('category.search.placeholder')}
                    />
                    <CommandList>
                      <CommandEmpty>{t('category.noneFound')}</CommandEmpty>
                      <CommandGroup>
                        {expenseDomains
                          .find((domain) => domain.title === category.author)
                          ?.parts.map((part) => (
                            <CommandItem
                              key={part}
                              value={part}
                              onSelect={(currentValue) => {
                                const newCategories = [...categories]
                                newCategories[index].category = currentValue
                                setPartDropdownOpen(-1)
                                validateCategories()
                              }}
                              className='flex items-center justify-between'
                            >
                              <div className='flex items-center gap-2'>
                                {part}
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
                <Label id='amounts' htmlFor='amounts'>
                  {t('amount')} <span className='text-red-500'>*</span>
                </Label>
              )}
              <span className='sr-only'>{`${t('amount')} ${index + 1}`}</span>
              <Input
                id={`amount-${index}`}
                name={`amount-${index}`}
                title={`${t('amount')} ${index + 1}`}
                aria-labelledby='amounts'
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
              tabIndex={-1}
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
        aria-label={t('addCategory')}
        id='add-category'
        name='add-category'
        size={'sm'}
        onClick={addCategory}
        disabled={categories[0].author === ''}
      >
        {t('addCategory')}
      </Button>
    </>
  )
}
