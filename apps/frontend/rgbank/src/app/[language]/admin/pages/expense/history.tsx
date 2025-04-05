import { Separator } from '@/components/ui/separator'

export default function ExpensesHistoryPage() {
  return (
    <section>
      <div className='-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>Expense History</h2>
        <p className='text-sm text-muted-foreground'>
          This page shows the history of all expenses that have been generated.
        </p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>
    </section>
  )
}
