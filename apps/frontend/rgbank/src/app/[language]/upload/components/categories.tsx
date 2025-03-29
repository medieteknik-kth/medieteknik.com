'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type Committee from '@/models/Committee'
import type { Category } from '@/models/Form'
import Image from 'next/image'

interface Props {
  categories: Category[]
  committees: Committee[]
}

export function CategoryOverviewByCommittee({ categories, committees }: Props) {
  const allCommittees = [
    ...committees.map((committee) => ({
      value: committee.committee_id,
      label: committee.translations[0].title,
      icon: committee.logo_url,
    })),
  ]
  // Filter out committees with no categories
  const committeesWithCategories = allCommittees.filter((committee) =>
    categories.some((category) => category.author === committee.value)
  )

  return (
    <Card className='shadow-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold leading-tight'>
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {committeesWithCategories.map((committee, committeeIndex) => {
          const authorCategories = categories.filter(
            (category) => category.author === committee.value
          )

          const totalAmount = authorCategories.reduce((acc, category) => {
            const amount = Number.parseFloat(category.amount.replace(/,/g, '.'))
            return acc + (Number.isNaN(amount) ? 0 : amount)
          }, 0)

          return (
            <div key={committee.value} className='space-y-4'>
              {committeeIndex > 0 && <Separator className='mb-4' />}

              <div className='flex items-start gap-4'>
                <div className='p-2 rounded-md flex items-center justify-center'>
                  <div className='w-10 h-10 bg-white p-0.5 rounded-lg'>
                    <Image
                      src={committee.icon || '/placeholder.svg'}
                      alt={committee.label}
                      width={40}
                      height={40}
                      className='object-cover'
                      unoptimized
                    />
                  </div>
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <h3 className='font-semibold'>{committee.label}</h3>
                    <Badge variant='outline'>
                      {totalAmount.toFixed(2)} SEK
                    </Badge>
                  </div>

                  <div className='mt-3 rounded-md border overflow-hidden'>
                    <Table>
                      <TableHeader>
                        <TableRow className='bg-muted/50'>
                          <TableHead className='w-[40%]'>Category</TableHead>
                          <TableHead className='w-[30%]'>Type</TableHead>
                          <TableHead className='w-[30%]'>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {authorCategories.map((category, index) => (
                          <TableRow
                            key={`${category.author}-${category.type}-${index}`}
                            className={
                              index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                            }
                          >
                            <TableCell className='font-medium'>
                              {category.category}
                            </TableCell>
                            <TableCell>{category.type}</TableCell>
                            <TableCell className='font-medium'>
                              {category.amount.replace(/,/g, '.')} SEK
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {committeesWithCategories.length === 0 && (
          <div className='text-center py-6 text-muted-foreground'>
            No categories found
          </div>
        )}
      </CardContent>
    </Card>
  )
}
