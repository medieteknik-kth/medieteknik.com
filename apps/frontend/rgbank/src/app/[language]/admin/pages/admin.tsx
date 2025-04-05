import { Separator } from '@/components/ui/separator'

export default function AdminPage() {
  return (
    <section>
      <div className='w-full mb-4 px-4 pt-4'>
        <h2 className='text-lg font-bold'>Admin</h2>
        <p className='text-sm text-muted-foreground'>
          This is the admin page. You can manage your invoices and expenses
          here.
        </p>
      </div>
      <Separator className='bg-yellow-400 mt-4' />
    </section>
  )
}
