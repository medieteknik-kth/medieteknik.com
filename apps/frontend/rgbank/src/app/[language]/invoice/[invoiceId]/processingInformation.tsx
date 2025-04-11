import { PopIn } from '@/components/animation/pop-in'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import type { LanguageCode } from '@/models/Language'
import { useInvoiceDetail } from '@/providers/DetailProvider'

interface Props {
  langauge: LanguageCode
}

export default function InvoiceProcessingInformation({ langauge }: Props) {
  const { invoice } = useInvoiceDetail()

  return (
    <PopIn delay={0.1}>
      <Card>
        <CardHeader>
          <CardTitle>Processing Information</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Current Status
            </h3>
            <ExpenseStatusBadge
              status={invoice.status}
              className='w-full mt-1'
            />
          </div>
          <Separator />
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Submitted On
            </h3>
            <p className='mt-1'>
              {new Date(invoice.created_at).toLocaleDateString(langauge, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </PopIn>
  )
}
