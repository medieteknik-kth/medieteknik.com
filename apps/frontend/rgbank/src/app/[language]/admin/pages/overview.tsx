import { Button } from '@/components/ui/button'
import { ExpenseBadge } from '@/components/ui/expense-badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { LanguageCode } from '@/models/Language'
import {
  ChatBubbleBottomCenterIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'

interface Props {
  language: LanguageCode
}

export default function OverviewPage({ language }: Props) {
  return (
    <section className='w-full h-fit max-w-[1100px] mb-8 2xl:mb-0'>
      <div className='w-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>Overview</h2>
        <p className='text-sm text-muted-foreground'>
          This is the overview page for the admin panel. Here you can see an
          overview of the application and its users.
        </p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>

      <div className='mx-4 space-y-4'>
        <Input placeholder='Search' />

        <div className='border rounded-md'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='pl-7'>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Committee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Button variant='link' size='sm'>
                    123456
                  </Button>
                </TableCell>
                <TableCell>
                  <ExpenseBadge type='expense' />
                </TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>Styrlesen</TableCell>
                <TableCell>2023-10-01</TableCell>
                <TableCell>$100.00</TableCell>
                <TableCell className='space-x-2'>
                  <ChatBubbleBottomCenterIcon className='h-5 w-5 inline-block' />
                  <span>7</span>
                </TableCell>
                <TableCell>
                  <Button size='icon' variant='ghost'>
                    <EyeIcon className='h-5 w-5' />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Button variant='link' size='sm' asChild>
                    <Link href={`/${language}/expense/123456`}>123456</Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <ExpenseBadge type='invoice' />
                </TableCell>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Styrlesen</TableCell>
                <TableCell>2023-10-02</TableCell>
                <TableCell>$200.00</TableCell>
                <TableCell className='space-x-2'>
                  <ChatBubbleBottomCenterIcon className='h-5 w-5 inline-block' />
                  <span>3</span>
                </TableCell>
                <TableCell>
                  <Button size='icon' variant='ghost'>
                    <EyeIcon className='h-5 w-5' />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
