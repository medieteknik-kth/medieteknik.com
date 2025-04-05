import { Separator } from '@/components/ui/separator'

export default function InvoicesAwaitingPage() {
  return (
    <section className='w-full h-fit max-w-[1100px] mb-8 2xl:mb-0'>
      <div className='w-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>Invoice Awaiting</h2>
        <p className='text-sm text-muted-foreground'>
          All invoices that are awaiting payment will be shown here.
        </p>
        <Separator className='bg-yellow-400 mt-4' />
      </div>
    </section>
  )
}
