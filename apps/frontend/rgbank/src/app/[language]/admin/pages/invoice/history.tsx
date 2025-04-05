import { Separator } from '@/components/ui/separator'

export default function InvoicesHistoryPage() {
  return (
    <section>
      <div className='-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>Invoice History</h2>
        <p className='text-sm text-muted-foreground'>
          This page shows the history of all invoices that have been generated.
        </p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>
    </section>
  )
}
