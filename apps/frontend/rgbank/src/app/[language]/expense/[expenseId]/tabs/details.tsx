import { ExpenseBadge } from '@/components/ui/expense-badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Details() {
  return (
    <section className='flex flex-col gap-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <h3 className='text-sm font-medium text-muted-foreground'>Type</h3>
          <ExpenseBadge type='invoice' className='mt-1' />
        </div>
        <div>
          <h3 className='text-sm font-medium text-muted-foreground'>Amount</h3>
          <p className='mt-1 text-lg font-semibold'>
            <span className='text-base text-muted-foreground select-none'>
              SEK
            </span>{' '}
            1000
          </p>
        </div>
        <div>
          <h3 className='text-sm font-medium text-muted-foreground'>Date</h3>
          <p className='mt-1'>2023-10-01</p>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className='text-sm font-medium text-muted-foreground'>
          Description
        </h3>
        <p className='mt-1'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
          suscipit accusamus libero vero dolores in voluptatum voluptatibus
          laudantium, veritatis mollitia blanditiis officia quod, cum dolorem
          possimus culpa impedit voluptas alias.
        </p>
      </div>
      <Separator />
      <div>
        <h3 className='text-sm font-medium text-muted-foreground'>
          Categories
        </h3>
        <div className='mt-1'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Committee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className='font-medium'>Styrelsen</TableCell>
                <TableCell>Food</TableCell>
                <TableCell>Expense</TableCell>
                <TableCell className='text-right'>SEK 500</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium'>Styrelsen</TableCell>
                <TableCell>Food</TableCell>
                <TableCell>Expense</TableCell>
                <TableCell className='text-right'>SEK 500</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
