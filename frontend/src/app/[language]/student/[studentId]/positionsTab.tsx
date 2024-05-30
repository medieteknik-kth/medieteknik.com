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
import { StudentCommitteePosition } from '@/models/Committee'
import { CommitteeTooltip } from '@/components/tooltips/Tooltip'

const testPositions: StudentCommitteePosition[] = [
  {
    committee: {
      type: 'committee',
      name: 'NLG',
      email: '',
      logo_url: NLGIcon.src,
    },
    position: {
      name: 'Webmaster',
      description: '',
    },
    initiatedDate: new Date('August 20 2023').toLocaleDateString(),
    endDate: new Date('August 20 2024').toLocaleDateString(),
  },
  {
    committee: {
      type: 'committee',
      name: 'Styrelsen',
      email: '',
      logo_url: StyrelsenIcon.src,
    },
    position: {
      name: 'Ordförande',
      description: '',
    },
    initiatedDate: new Date('January 20 2022').toLocaleDateString(),
    endDate: new Date('January 20 2023').toLocaleDateString(),
  },
  {
    committee: {
      type: 'committee',
      name: 'Styrelsen',
      email: '',
      logo_url: StyrelsenIcon.src,
    },
    position: {
      name: 'Vice-Ordförande',
      description: '',
    },
    initiatedDate: new Date('January 20 2021').toLocaleDateString(),
    endDate: new Date('January 20 2022').toLocaleDateString(),
  },
  {
    committee: {
      type: 'committee',
      name: 'Styrelsen',
      email: '',
      logo_url: StyrelsenIcon.src,
    },
    position: {
      name: 'Kassör',
      description: '',
    },
    initiatedDate: new Date('January 20 2020').toLocaleDateString(),
    endDate: new Date('January 20 2021').toLocaleDateString(),
  },
  {
    committee: {
      type: 'committee',
      name: 'Styrelsen',
      email: '',
      logo_url: StyrelsenIcon.src,
    },
    position: {
      name: 'Sekreterare',
      description: '',
    },
    initiatedDate: new Date('January 20 2019').toLocaleDateString(),
    endDate: new Date('January 20 2020').toLocaleDateString(),
  },
  {
    committee: {
      type: 'committee',
      name: 'Styrelsen',
      email: '',
      logo_url: StyrelsenIcon.src,
    },
    position: {
      name: 'Vice-Sekreterare',
      description: '',
    },
    initiatedDate: new Date('January 20 2018').toLocaleDateString(),
    endDate: new Date('January 20 2019').toLocaleDateString(),
  },
  {
    committee: {
      type: 'committee',
      name: 'Styrelsen',
      email: '',
      logo_url: StyrelsenIcon.src,
    },
    position: {
      name: 'Ledamot',
      description: '',
    },
    initiatedDate: new Date('January 20 2017').toLocaleDateString(),
    endDate: new Date('January 20 2018').toLocaleDateString(),
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
    (position) => new Date(position.endDate) > new Date()
  )
  const previousPositions = testPositions.filter(
    (position) => new Date(position.endDate) < new Date()
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
                    <TableCell>{position.position.name}</TableCell>
                    <TableCell className='flex items-center'>
                      <Avatar className='w-6 h-auto mr-1'>
                        <AvatarImage
                          src={position.committee.logo_url}
                          alt='Profile Picture'
                        />
                        <AvatarFallback>Profile Picture</AvatarFallback>
                      </Avatar>
                      {position.committee.name}
                    </TableCell>
                    <TableCell>
                      {new Date(position.initiatedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(position.endDate).toLocaleDateString()}
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
                    <TableCell>{position.position.name}</TableCell>
                    <TableCell className='flex items-center'>
                      <Avatar className='w-6 h-auto mr-1'>
                        <AvatarImage
                          src={position.committee.logo_url}
                          alt='Profile Picture'
                        />
                        <AvatarFallback>Profile Picture</AvatarFallback>
                      </Avatar>
                      {position.committee.name}
                    </TableCell>
                    <TableCell>
                      {new Date(position.initiatedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(position.endDate).toLocaleDateString()}
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
