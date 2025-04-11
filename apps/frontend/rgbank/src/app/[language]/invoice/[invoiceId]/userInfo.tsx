import { PopIn } from '@/components/animation/pop-in'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { LanguageCode } from '@/models/Language'
import { useGeneralDetail } from '@/providers/DetailProvider'

interface Props {
  language: LanguageCode
}

export default function InvoiceStudentInformation({ language }: Props) {
  const { student, bankAccount } = useGeneralDetail()

  return (
    <PopIn delay={0.2}>
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>Name</h3>
            <p className='mt-1'>
              {student.first_name} {student.last_name}
            </p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>Email</h3>
            <p className='mt-1'>{student.email}</p>
          </div>
          <Separator />
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Bank Name
            </h3>
            <p className='mt-1'>{bankAccount.bank_name}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Clearing Number
            </h3>
            <p className='mt-1'>{bankAccount.clearing_number}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Account Number
            </h3>
            <p className='mt-1'>{bankAccount.account_number}</p>
          </div>
        </CardContent>
      </Card>
    </PopIn>
  )
}
