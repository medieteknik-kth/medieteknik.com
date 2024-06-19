import Student from '@/models/Student'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Logo from 'public/images/logo.png'
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import NLGIcon from 'public/images/committees/nlg.png'
import { StudentCommitteePosition } from '@/models/Student'
import { CommitteeTooltip } from '@/components/tooltips/Tooltip'

const testPositions: StudentCommitteePosition[] = [
  {
    student: {
      author_type: 'STUDENT',
      email: 'andree4@kth.se',
      first_name: 'Andree',
      last_name: 'Eriksson',
      student_type: 'MEDIETEKNIK',
    },
    position: {
      title: 'Webmaster',
      active: true,
      author_type: 'COMMITTEE_POSITION',
      email: '',
      role: 'ADMIN',
      weight: 0,
      description: '',
    },
    initiation_date: new Date('August 20 2023').toLocaleDateString(),
    termination_date: new Date('August 20 2024').toLocaleDateString(),
  },
  {
    student: {
      author_type: 'STUDENT',
      email: 'andree4@kth.se',
      first_name: 'Andree',
      last_name: 'Eriksson',
      student_type: 'MEDIETEKNIK',
    },
    position: {
      title: 'Ordförande',
      active: true,
      author_type: 'COMMITTEE_POSITION',
      email: '',
      role: 'ADMIN',
      weight: 0,
      description: '',
    },
    initiation_date: new Date('January 20 2022').toLocaleDateString(),
    termination_date: new Date('January 20 2023').toLocaleDateString(),
  },
  {
    student: {
      author_type: 'STUDENT',
      email: 'andree4@kth.se',
      first_name: 'Andree',
      last_name: 'Eriksson',
      student_type: 'MEDIETEKNIK',
    },
    position: {
      title: 'Vice-Ordförande',
      active: true,
      author_type: 'COMMITTEE_POSITION',
      email: '',
      role: 'ADMIN',
      weight: 0,
      description: '',
    },
    initiation_date: new Date('January 20 2021').toLocaleDateString(),
    termination_date: new Date('January 20 2022').toLocaleDateString(),
  },
  {
    student: {
      author_type: 'STUDENT',
      email: 'andree4@kth.se',
      first_name: 'Andree',
      last_name: 'Eriksson',
      student_type: 'MEDIETEKNIK',
    },
    position: {
      title: 'Kassör',
      active: true,
      author_type: 'COMMITTEE_POSITION',
      email: '',
      role: 'ADMIN',
      weight: 0,
      description: '',
    },
    initiation_date: new Date('January 20 2020').toLocaleDateString(),
    termination_date: new Date('January 20 2021').toLocaleDateString(),
  },
  {
    student: {
      author_type: 'STUDENT',
      email: 'andree4@kth.se',
      first_name: 'Andree',
      last_name: 'Eriksson',
      student_type: 'MEDIETEKNIK',
    },
    position: {
      title: 'Sekreterare',
      active: true,
      author_type: 'COMMITTEE_POSITION',
      email: '',
      role: 'ADMIN',
      weight: 0,
      description: '',
    },
    initiation_date: new Date('January 20 2019').toLocaleDateString(),
    termination_date: new Date('January 20 2020').toLocaleDateString(),
  },
  {
    student: {
      author_type: 'STUDENT',
      email: 'andree4@kth.se',
      first_name: 'Andree',
      last_name: 'Eriksson',
      student_type: 'MEDIETEKNIK',
    },
    position: {
      title: 'Vice-Sekreterare',
      active: true,
      author_type: 'COMMITTEE_POSITION',
      email: '',
      role: 'ADMIN',
      weight: 0,
      description: '',
    },
    initiation_date: new Date('January 20 2018').toLocaleDateString(),
    termination_date: new Date('January 20 2019').toLocaleDateString(),
  },
  {
    student: {
      author_type: 'STUDENT',
      email: 'andree4@kth.se',
      first_name: 'Andree',
      last_name: 'Eriksson',
      student_type: 'MEDIETEKNIK',
    },
    position: {
      title: 'Ledamot',
      active: true,
      author_type: 'COMMITTEE_POSITION',
      email: '',
      role: 'ADMIN',
      weight: 0,
      description: '',
    },
    initiation_date: new Date('January 20 2017').toLocaleDateString(),
    termination_date: new Date('January 20 2018').toLocaleDateString(),
  },
]

export default function StudentPositions({
  language,
  student,
}: {
  language: string
  student: Student
}) {
  const hasAnyPostion = testPositions.length > 0
  const activePositions = testPositions.filter(
    (position) => new Date(position.termination_date) > new Date()
  )
  const previousPositions = testPositions.filter(
    (position) => new Date(position.termination_date) < new Date()
  )
  return (
    <div className='flex'>
      <div className='mr-10'>
        <h2 className='text-2xl border-b-2 border-yellow-400 py-1 mb-1'>
          Active Positions
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
            <TableBody>
              {hasAnyPostion ? (
                activePositions.map((position, index) => (
                  <TableRow key={index}>
                    <TableCell>{position.position.title}</TableCell>
                    <TableCell className='flex items-center'>
                      <Avatar className='w-6 h-auto mr-1'>
                        <AvatarImage src={''} alt='Profile Picture' />
                        <AvatarFallback>Profile Picture</AvatarFallback>
                      </Avatar>
                      {''}
                    </TableCell>
                    <TableCell>
                      {new Date(position.initiation_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(position.termination_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No Positions</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className='ml-10'>
        <h2 className='text-2xl border-b-2 border-yellow-400 py-1 mb-1'>
          Past Positions
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
            <TableBody>
              {hasAnyPostion ? (
                previousPositions.map((position, index) => (
                  <TableRow key={index}>
                    <TableCell>{position.position.title}</TableCell>
                    <TableCell className='flex items-center'>
                      <Avatar className='w-6 h-auto mr-1'>
                        <AvatarImage src={''} alt='Profile Picture' />
                        <AvatarFallback>Profile Picture</AvatarFallback>
                      </Avatar>
                      {''}
                    </TableCell>
                    <TableCell>
                      {new Date(position.initiation_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(position.termination_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No Positions</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
