import {
  PhotoIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
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
import { Button } from '@/components/ui/button'

export default function StaticPage({
  language,
  committee,
}: {
  language: string
  committee: string
}) {
  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>
        Static Pages
      </h2>
      <div className='flex flex-col mt-4'>
        <div className='flex mb-4'>
          <Card className='w-72 relative'>
            <CardHeader>
              <CardTitle>Pages</CardTitle>
              <CardDescription>
                <GlobeAltIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total of Static Pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl'>10</p>
            </CardContent>
          </Card>
        </div>
        <Card className='relative'>
          <CardHeader>
            <CardTitle>Static Pages</CardTitle>
            <CardDescription>
              <PencilSquareIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
              Static Pages this committee can edit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='max-w-[650px] truncate'>
                    Committee
                  </TableCell>
                  <TableCell className='max-w-[650px] truncate'>
                    <Link
                      href={`./`}
                      className='text-blue-500 hover:underline underline-offset-4 decoration-yellow-400'
                    >
                      ./chapter/committee/{committee}
                    </Link>
                  </TableCell>
                  <TableCell className='flex'>
                    <div className='flex items-center mr-2'>
                      <DocumentTextIcon className='w-5 h-5 mr-2' />
                      <p>250</p>
                    </div>
                    <div className='flex items-center'>
                      <PhotoIcon className='w-5 h-5 mr-2' />
                      <p>4</p>
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button size='icon'>
                      <PencilSquareIcon className='w-6 h-6' />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='max-w-[650px] truncate'>
                    Chapter
                  </TableCell>
                  <TableCell className='max-w-[650px] truncate'>
                    <Link
                      href={`../../`}
                      className='text-blue-500 hover:underline underline-offset-4 decoration-yellow-400'
                    >
                      ./chapter
                    </Link>
                  </TableCell>
                  <TableCell className='flex'>
                    <div className='flex items-center mr-2'>
                      <DocumentTextIcon className='w-5 h-5 mr-2' />
                      <p>250</p>
                    </div>
                    <div className='flex items-center'>
                      <PhotoIcon className='w-5 h-5 mr-2' />
                      <p>0</p>
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button size='icon'>
                      <PencilSquareIcon className='w-6 h-6' />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
