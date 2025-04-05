import { Separator } from '@/components/ui/separator'

export default function ExpensesAwaitingPage() {
  return (
    <section>
      <div className='-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>Expenses Awaiting</h2>
        <p className='text-sm text-muted-foreground'>
          All expenses that are awaiting payment will be shown here.
        </p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>
    </section>
  )
}
