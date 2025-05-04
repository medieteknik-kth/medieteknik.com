'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { toast } from '@/components/ui/use-toast'
import type { ExpenseResponse } from '@/models/Expense'
import type { ExpenseDomain } from '@/models/ExpenseDomain'
import type { Category } from '@/models/Form'
import type { InvoiceResponse } from '@/models/Invoice'
import type { LanguageCode } from '@/models/Language'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useCallback, useState } from 'react'
import useSWR from 'swr'

interface Props {
  language: LanguageCode
  item: InvoiceResponse | ExpenseResponse
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminCategoriesSection({ language, item }: Props) {
  const [categories, setCategories] = useState<Category[]>(
    item.categories || []
  )
  const [dropdownOpen, setDropdownOpen] = useState(-1) // -1 = none, i = index of the dropdown open
  const [partDropdownOpen, setPartDropdownOpen] = useState(-1) // -1 = none, i = index of the dropdown open
  const {
    data: expenseDomains,
    error,
    isLoading,
  } = useSWR<ExpenseDomain[]>('/api/public/rgbank/expense-domains', fetcher, {
    fallbackData: [],
  })
  const { t } = useTranslation(language, 'processing')
  const { t: expenseT } = useTranslation(language, 'expense')
  const { t: invoiceT } = useTranslation(language, 'invoice')
  let categoryIndex = 100

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

  const isInvoice = 'invoice_id' in item

  const handleSubmit = async () => {
    const url = isInvoice
      ? `/api/rgbank/invoices/${item.invoice_id}/categories`
      : `/api/rgbank/expenses/${item.expense_id}/categories`

    const filteredCategories = categories.filter(
      (category) => category.author && category.category
    )
    const updatedCategories = filteredCategories.map((category) => {
      return {
        ...category,
        amount: category.amount.replace(',', '.'),
      }
    })

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedCategories,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to update categories')
      }

      toast({
        title: 'Success',
        description: 'Categories updated successfully',
      })

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error updating categories:', error)
    }
  }

  if (
    error ||
    (Array.isArray(expenseDomains) && expenseDomains.length === 0) ||
    !expenseDomains
  ) {
    return <p>Error loading expense domains</p>
  }

  if (isLoading) {
    return <p>Loading expense domains...</p>
  }

  const allDomains = expenseDomains.map((domain) => {
    return {
      label: domain.title,
      value: domain.expense_part_id,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.categories.title')}</CardTitle>
        <CardDescription>
          {t('admin.categories.description', {
            type: isInvoice ? invoiceT('invoice') : expenseT('expense'),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Button variant='outline' className='space-x-2' onClick={addCategory}>
          <PlusIcon className='h-4 w-4' />
          <p>{t('admin.categories.add')}</p>
        </Button>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className='space-y-4'
        >
          <ul className='space-y-6'>
            {categories.map((category, index) => (
              <li
                key={category.id}
                className='flex flex-wrap items-center justify-between gap-2 p-4 border rounded-lg relative'
              >
                <div className='absolute -top-4 -left-4 flex items-center justify-center w-8 h-8 text-sm font-bold text-black bg-primary rounded-full'>
                  {index + 1}
                </div>
                <div className='w-full flex flex-col gap-2 col-span-4'>
                  <Label>{t('admin.categories.domain')}</Label>
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
                        disabled={index !== 0}
                        role='combobox'
                        className='w-full items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          {allDomains.find(
                            (domain) => domain.label === category.author
                          )?.label || t('admin.categories.domain.placeholder')}
                        </div>
                        <ChevronDownIcon className='w-5 h-5' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-96! p-0'>
                      <Command>
                        <CommandInput
                          placeholder={t('admin.categories.search')}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {t('admin.categories.empty')}
                          </CommandEmpty>
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
                                }}
                                className='flex items-center justify-between'
                              >
                                <div className='flex items-center gap-2'>
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
                  <Label>{t('admin.categories.category')}</Label>
                  <Popover
                    open={partDropdownOpen === index}
                    onOpenChange={() => {
                      setPartDropdownOpen((prev) =>
                        prev === index ? -1 : index
                      )
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                        role='combobox'
                        className='grow items-center justify-between'
                      >
                        <div className='flex items-center gap-2 max-w-64 2xl:max-w-max'>
                          <p className='truncate'>
                            {category.category ||
                              t('admin.categories.category.select')}
                          </p>
                        </div>
                        <ChevronDownIcon className='w-5 h-5' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-96! p-0'>
                      <Command>
                        <CommandInput
                          placeholder={t('admin.categories.search')}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {t('admin.categories.empty')}
                          </CommandEmpty>
                          <CommandGroup>
                            {expenseDomains
                              .find(
                                (domain) => domain.title === category.author
                              )
                              ?.parts.map((part) => (
                                <CommandItem
                                  key={part}
                                  value={part}
                                  onSelect={(currentValue) => {
                                    const newCategories = [...categories]
                                    newCategories[index].category = currentValue
                                    setPartDropdownOpen(-1)
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
                  <Label>{t('admin.categories.amount')}</Label>
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
              </li>
            ))}
          </ul>
          <Button type='submit'>{t('admin.categories.submit')}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
