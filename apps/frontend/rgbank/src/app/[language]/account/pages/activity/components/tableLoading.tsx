import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export default function TableLoading() {
  return Array.from({ length: 5 }).map(() => (
    <TableRow key={crypto.randomUUID()}>
      <TableCell>
        <Skeleton className='h-4 w-96' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-44' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-32' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-44' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-24' />
      </TableCell>
    </TableRow>
  ))
}
