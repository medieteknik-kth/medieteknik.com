'use client'

import { useTranslation } from '@/app/i18n/client'
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
import type { Category } from '@/models/Form'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'

interface Props {
  language: LanguageCode
  categories: Category[]
}

export function CategoryOverviewByCommittee({ language, categories }: Props) {
  const { t } = useTranslation(language, 'upload/finalize/categories')
  const totalAmount = categories.reduce((acc, category) => {
    const amount = Number.parseFloat(category.amount.replace(/,/g, '.'))
    return acc + (Number.isNaN(amount) ? 0 : amount)
  }, 0)

  return (
    <Card className='shadow-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold leading-tight'>
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div key={categories[0].author} className='space-y-4'>
          <div className='flex items-start gap-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold'>{categories[0].author}</h3>
                <Badge variant='outline'>
                  {totalAmount.toLocaleString(language, {
                    currency: 'SEK',
                    style: 'currency',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Badge>
              </div>

              <div className='mt-3 rounded-md border overflow-hidden'>
                <Table>
                  <TableHeader>
                    <TableRow className='bg-muted/50'>
                      <TableHead className='w-1/2'>{t('category')}</TableHead>
                      <TableHead className='w-1/2'>{t('amount')}</TableHead>
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
                          {Number.parseFloat(
                            category.amount.replace(/,/g, '.')
                          ).toLocaleString(language, {
                            currency: 'SEK',
                            style: 'currency',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
            {t('notFound')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
