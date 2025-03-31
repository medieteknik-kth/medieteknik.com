import { Button } from '@/components/ui/button'
import {
  ArrowDownTrayIcon,
  DocumentIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline'

export default function Files() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='h-52 border border-dashed rounded-md flex flex-col items-center justify-center gap-2'>
        <DocumentIcon className='h-8 w-8 text-muted-foreground' />
        <div className='flex flex-col items-center'>
          <h3 className='text-lg font-semibold'>test.pdf</h3>
          <p className='text-sm text-muted-foreground'>1.2 MB</p>
        </div>
        <div className='flex gap-2'>
          <Button className='flex items-center gap-2'>
            <ArrowDownTrayIcon className='h-4 w-4' />
            Download
          </Button>
          <Button variant={'outline'} className='flex items-center gap-2'>
            <PrinterIcon className='h-4 w-4' />
            Print
          </Button>
        </div>
      </div>
      <div className='h-52 border border-dashed rounded-md flex flex-col items-center justify-center gap-2'>
        <DocumentIcon className='h-8 w-8 text-muted-foreground' />
        <div className='flex flex-col items-center'>
          <h3 className='text-lg font-semibold'>test.pdf</h3>
          <p className='text-sm text-muted-foreground'>1.2 MB</p>
        </div>
        <div className='flex gap-2'>
          <Button className='flex items-center gap-2'>
            <ArrowDownTrayIcon className='h-4 w-4' />
            Download
          </Button>
          <Button variant={'outline'} className='flex items-center gap-2'>
            <PrinterIcon className='h-4 w-4' />
            Print
          </Button>
        </div>
      </div>
      <div className='h-52 border border-dashed rounded-md flex flex-col items-center justify-center gap-2'>
        <DocumentIcon className='h-8 w-8 text-muted-foreground' />
        <div className='flex flex-col items-center'>
          <h3 className='text-lg font-semibold'>test.pdf</h3>
          <p className='text-sm text-muted-foreground'>1.2 MB</p>
        </div>
        <div className='flex gap-2'>
          <Button className='flex items-center gap-2'>
            <ArrowDownTrayIcon className='h-4 w-4' />
            Download
          </Button>
          <Button variant={'outline'} className='flex items-center gap-2'>
            <PrinterIcon className='h-4 w-4' />
            Print
          </Button>
        </div>
      </div>
    </div>
  )
}
