'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface Props {
  categories: Category[]
  committees: Committee[]
}

export function CategoryOverviewByCommittee({ categories, committees }: Props) {
  const totalAmount = categories.reduce((acc, category) => {
    const amount = Number.parseFloat(category.amount.replace(/,/g, '.'))
    return acc + (Number.isNaN(amount) ? 0 : amount)
  }, 0)

  return (
    <Card className='shadow-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold leading-tight'>
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div key={categories[0].author} className='space-y-4'>
          <div className='flex items-start gap-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold'>{categories[0].author}</h3>
                <Badge variant='outline'>{totalAmount.toFixed(2)} SEK</Badge>
              </div>

              <div className='mt-3 rounded-md border overflow-hidden'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-muted/50'>
                      <TableHead className='w-1/2'>Category</TableHead>
                      <TableHead className='w-1/2'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category, index) => (
                      <TableRow
                        key={`${category.author}-${index}`}
                        className={
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }
                      >
                        <TableCell className='font-medium'>
                          {category.category}
                        </TableCell>
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
        {categories.length === 0 && (
          <div className='text-center py-6 text-muted-foreground'>
            No categories found
          </div>
        )}
      </CardContent>
    </Card>
  )
}
