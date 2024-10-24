import { TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MediaToolbar() {
  return (
    <section className='px-10 h-16 border-b flex gap-2 items-center'>
      <TabsList className='h-12'>
        <TabsTrigger value='committees' className='w-32 h-full'>
          Committees
        </TabsTrigger>
        <TabsTrigger value='events' className='w-32 h-full'>
          Events
        </TabsTrigger>
      </TabsList>
    </section>
  )
}
