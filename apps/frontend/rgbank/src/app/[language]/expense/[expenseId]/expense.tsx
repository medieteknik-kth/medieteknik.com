import BackButton from '@/app/[language]/expense/[expenseId]/back'
import Comments from '@/app/[language]/expense/[expenseId]/tabs/comments'
import Details from '@/app/[language]/expense/[expenseId]/tabs/details'
import Files from '@/app/[language]/expense/[expenseId]/tabs/files'
import { PopIn } from '@/components/animation/pop-in'
import HeaderGap from '@/components/header/components/HeaderGap'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExpenseStatusBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LanguageCode } from '@/models/Language'
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline'

interface Params {
  language: LanguageCode
  expenseId: string
}

interface Props {
  params: Promise<Params>
}

export default async function ExpensePage(props: Props) {
  // TODO: Fetch expense data from API
  const { language, expenseId } = await props.params

  return (
    <main>
      <HeaderGap />
      <div className='container '>
        <div className='mx-auto max-w-4xl flex flex-col gap-4 py-10'>
          <section className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <BackButton />
              <div>
                <h1 className='text-3xl font-bold'>Expense {expenseId}</h1>
                <p className='text-muted-foreground'>
                  Submitted by {'<'}user{'>'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline' className='flex items-center gap-2'>
                <ArrowDownTrayIcon className='h-4 w-4' />
                Download PDF
              </Button>
              <Button variant='outline' className='flex items-center gap-2'>
                <PrinterIcon className='h-4 w-4' />
                Print
              </Button>
            </div>
          </section>
          <section className='grid grid-cols-3 gap-4'>
            <PopIn className='col-span-2'>
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle>Expense Details</CardTitle>
                    <ExpenseStatusBadge status={'approved'} />
                  </div>
                  <CardDescription>
                    Complete details of the expense will be shown here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue='details' className='w-full'>
                    <TabsList>
                      <TabsTrigger value='details'>Details</TabsTrigger>
                      <TabsTrigger value='files'>Files</TabsTrigger>
                      <TabsTrigger value='comments'>Comments</TabsTrigger>
                    </TabsList>
                    <TabsContent value='details'>
                      <Details />
                    </TabsContent>
                    <TabsContent value='files'>
                      <Files />
                    </TabsContent>
                    <TabsContent value='comments'>
                      <Comments />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </PopIn>
            <div className='flex flex-col gap-4'>
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
                        status={'approved'}
                        className='w-full mt-1'
                      />
                    </div>
                    <Separator />
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Submitted On
                      </h3>
                      <p className='mt-1'>2023-10-01 14:20:00</p>
                    </div>
                  </CardContent>
                </Card>
              </PopIn>
              <PopIn delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                  </CardHeader>
                  <CardContent className='flex flex-col gap-4'>
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Name
                      </h3>
                      <p className='mt-1'>John Doe</p>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Email
                      </h3>
                      <p className='mt-1'>johndoe@mail.com</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Bank
                      </h3>
                      <p className='mt-1'>SEB Bank, SEB Bankgiro, 1234-5678</p>
                    </div>
                  </CardContent>
                </Card>
              </PopIn>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
