import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IndividualCommitteePosition } from '@/models/Student'
import Image from 'next/image'
import FallbackLogo from 'public/images/logo.webp'

function TableDisplay({
  positions,
  language,
}: {
  positions: IndividualCommitteePosition[]
  language: string
}) {
  return (
    <TableBody>
      {positions.length > 0 &&
        positions.map((position, index) => (
          <TableRow key={index}>
            <TableCell className='dark:text-white'>
              {position.position.translations[0].title}
            </TableCell>
            <TableCell className='flex items-center'>
              {position.position.committee ? (
                <Avatar className='w-6 h-auto aspect-square mr-1'>
                  <AvatarImage
                    src={position.position.committee.logo_url}
                    alt='Profile Picture'
                  />
                  <AvatarFallback className='bg-white'>
                    <Image
                      src={FallbackLogo}
                      alt='Logo'
                      width={64}
                      height={64}
                      className='object-cover'
                    />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <p className='text-neutral-600 dark:text-neutral-300 uppercase select-none px-2'>
                  Independent
                </p>
              )}
            </TableCell>
            <TableCell className='dark:text-white'>
              {new Date(position.initiation_date).toLocaleDateString()}
            </TableCell>
            <TableCell className='dark:text-white'>
              {position.termination_date
                ? new Date(position.termination_date).toLocaleDateString()
                : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  )
}

export default function StudentPositions({
  language,
  positions,
}: {
  language: string
  positions: IndividualCommitteePosition[]
}) {
  if (positions.length === 0) {
    return (
      <div>
        <h2>No positions</h2>
      </div>
    )
  }

  const activePositions: IndividualCommitteePosition[] = positions.filter(
    (position) =>
      new Date(position.termination_date) > new Date() ||
      position.termination_date === null
  )
  const previousPositions = positions.filter(
    (position) =>
      new Date(position.termination_date) < new Date() &&
      position.termination_date !== null
  )
  return (
    <div className='flex'>
      <div className='mr-10'>
        <h2 className='text-2xl border-b-2 border-yellow-400 py-1 mb-1 dark:text-white'>
          <b>{activePositions.length}</b> Active Positions
        </h2>
        <div className='max-h-[560.5px] overflow-hidden overflow-y-auto'>
          <Table className='w-[700px] max-h-[606.5px] overflow-y-auto overflow-hidden'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[225px]'>Title Position</TableHead>
                <TableHead className='w-[150px]'>Position Category</TableHead>
                <TableHead className='w-[150px]'>Initiation Date</TableHead>
                <TableHead className='w-[175px]'>Expected End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableDisplay positions={activePositions} language={language} />
          </Table>
        </div>
      </div>

      <div className='ml-10'>
        <h2 className='text-2xl border-b-2 border-yellow-400 py-1 mb-1 dark:text-white'>
          <b>{previousPositions.length}</b> Past Positions
        </h2>
        <div className='max-h-[560.5px] overflow-hidden overflow-y-auto'>
          <Table className='w-[700px]'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[225px]'>Title Position</TableHead>
                <TableHead className='w-[150px]'>Position Category</TableHead>
                <TableHead className='w-[150px]'>Initiation Date</TableHead>
                <TableHead className='w-[175px]'>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableDisplay positions={previousPositions} language={language} />
          </Table>
        </div>
      </div>
    </div>
  )
}
