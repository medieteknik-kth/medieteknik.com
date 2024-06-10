import {
  NewspaperIcon,
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  PhotoIcon,
  ArrowTopRightOnSquareIcon,
  UsersIcon,
  ClockIcon,
  HandRaisedIcon,
  NoSymbolIcon,
  TrashIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  OngoingEventBadge,
  UpcomingEventBadge,
} from '@/components/badges/Items'

export default function HomePage({ language }: { language: string }) {
  return (
    <section className='grow w-full'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>Home</h2>
      <div className='flex flex-col'>
        <div className='h-fit flex flex-wrap mt-4 mb-4'>
          <Card className='w-64 relative mr-4'>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                <UsersIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Active Students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl'>20</p>
            </CardContent>
          </Card>
          <Card className='w-64 relative mr-4'>
            <CardHeader>
              <CardTitle>News Articles</CardTitle>
              <CardDescription>
                <NewspaperIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl'>20 000</p>
            </CardContent>
          </Card>
          <Card className='w-64 relative mr-4'>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                <CalendarDaysIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl'>200</p>
            </CardContent>
          </Card>
          <Card className='w-64 relative mr-4'>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                <DocumentDuplicateIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl'>150</p>
            </CardContent>
          </Card>
          <Card className='w-64 relative'>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                <PhotoIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl'>100</p>
            </CardContent>
          </Card>
        </div>
        <div className='mb-4'>
          <Card className='relative'>
            <CardHeader>
              <CardTitle>Upcoming Hosted Events</CardTitle>
              <CardDescription>
                <ClockIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Events that this committee is hosting (only upcoming and ongoing
                events)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='max-w-52'>Title</TableHead>
                    <TableHead className='w-36'>Event Status</TableHead>
                    <TableHead className='w-36'>Start Date</TableHead>
                    <TableHead className='w-36'>End Date</TableHead>
                    <TableHead className='w-96'>Location</TableHead>
                    <TableHead className='text-right w-48'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>SM #4</TableCell>
                    <TableCell className='relative'>
                      <OngoingEventBadge language={language} />
                    </TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell className=''>Random location</TableCell>
                    <TableCell className='text-right w-48'>
                      <Button
                        size={'icon'}
                        variant={'outline'}
                        className='mr-2'
                      >
                        <Cog6ToothIcon className='w-5 h-5' />
                      </Button>
                      <Button
                        size={'icon'}
                        variant={'outline'}
                        className='mr-2'
                      >
                        <ArrowTopRightOnSquareIcon className='w-5 h-5' />
                      </Button>
                      <Button
                        size={'icon'}
                        variant={'destructive'}
                        className='mr-2'
                      >
                        <TrashIcon className='w-5 h-5' />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>FR #4</TableCell>
                    <TableCell className='relative'>
                      <UpcomingEventBadge language={language} />
                    </TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell>Random location</TableCell>
                    <TableCell className='text-right w-48'>
                      <Button
                        size={'icon'}
                        variant={'outline'}
                        className='mr-2'
                      >
                        <Cog6ToothIcon className='w-5 h-5' />
                      </Button>
                      <Button
                        size={'icon'}
                        variant={'outline'}
                        className='mr-2'
                      >
                        <ArrowTopRightOnSquareIcon className='w-5 h-5' />
                      </Button>
                      <Button
                        size={'icon'}
                        variant={'destructive'}
                        className='mr-2'
                      >
                        <TrashIcon className='w-5 h-5' />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className='relative'>
            <CardHeader>
              <CardTitle>Currently Recruiting</CardTitle>
              <CardDescription>
                <HandRaisedIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Open positions that this committee is currently recruiting for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Chairperson</TableCell>
                    <TableCell className='relative'>
                      <div className='absolute top-0 bottom-0 my-auto w-2 h-2 rounded-full bg-lime-500' />
                      <p className='ml-4'>Open</p>
                    </TableCell>
                    <TableCell>2 Days</TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant={'outline'}
                        size={'icon'}
                        title='Extend Deadline'
                        className='mr-2'
                      >
                        <ClockIcon className='w-6 h-6' />
                      </Button>
                      <Button
                        variant={'destructive'}
                        size={'icon'}
                        title='End Early'
                      >
                        <NoSymbolIcon className='w-6 h-6' />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
