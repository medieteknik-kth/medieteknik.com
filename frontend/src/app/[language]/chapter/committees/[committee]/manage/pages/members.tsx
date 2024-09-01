'use client'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BuildingOffice2Icon,
  CircleStackIcon,
  ClockIcon,
  Cog6ToothIcon,
  IdentificationIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import PositionForm from '../forms/positionForm'
import Committee from '@/models/Committee'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import RecruitmentForm from '../forms/recruitmentForm'
import { StudentTag } from '@/components/tags/StudentTag'
import { AddMemberForm, RemoveMemberForm } from '../forms/memberForm'
import RemovePositionForm from '../forms/removePosition'

/**
 * @name MembersPage
 * @description The page for managing a committees members
 *
 * @param {string} language - The language of the page
 * @param {Committee} committee - The committee to manage
 * @returns {JSX.Element} The rendered component
 */
export default function MembersPage({
  committee,
  language,
}: {
  committee: Committee
  language: string
}): JSX.Element {
  // TODO: Clean-up the code, separate the components into smaller components?
  const [isLoading, setIsLoading] = useState(true)
  const [addPositionOpen, setAddPositionOpen] = useState(false)
  const {
    members,
    positions,
    isLoading: isLoadingMembers,
    error,
    recruitments,
    addPosition,
  } = useCommitteeManagement()

  const findPosition = (id: string) => {
    return positions.find((position) => position.committee_position_id === id)
  }

  useEffect(() => {
    if (!isLoadingMembers) {
      setIsLoading(false)
    }
  }, [isLoadingMembers])

  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>
        Members & Positions
      </h2>
      <div className='flex flex-col mt-4 gap-4'>
        <div className='flex'>
          <Card className='w-fit relative mr-4'>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                <UsersIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Active Students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{members.total_items}</p>
              )}
            </CardContent>
            <CardFooter className='flex gap-4'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'outline'}
                    disabled={error !== null}
                    title='Add a new member to the committee'
                  >
                    <PlusIcon className='w-5 h-5 mr-2' />
                    Add
                  </Button>
                </DialogTrigger>
                <AddMemberForm language={language} />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'destructive'}
                    disabled={members.total_items === 0 || error !== null}
                    title='Remove a member from the committee'
                  >
                    <TrashIcon className='w-5 h-5 mr-2' />
                    Remove
                  </Button>
                </DialogTrigger>
                <RemoveMemberForm language={language} />
              </Dialog>
            </CardFooter>
          </Card>

          <Card className='w-fit relative mr-4'>
            <CardHeader>
              <CardTitle>Positions</CardTitle>
              <CardDescription>
                <IdentificationIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Positions in the committee
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{positions.length}</p>
              )}
            </CardContent>
            <CardFooter>
              <Dialog open={addPositionOpen} onOpenChange={setAddPositionOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant={'outline'}
                    className='mr-4'
                    disabled={error !== null}
                    title='Create a new position to the committee'
                  >
                    <PlusIcon className='w-5 h-5 mr-2' />
                    Create
                  </Button>
                </DialogTrigger>
                <PositionForm
                  committee={committee}
                  language={language}
                  onSuccess={(position) => {
                    addPosition(position)
                    setAddPositionOpen(false)
                  }}
                />
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'outline'}
                    className='mr-4'
                    disabled={error !== null || positions.length === 0}
                    title='Open a position for recruitment'
                  >
                    <ClockIcon className='w-5 h-5 mr-2' />
                    Recruit
                  </Button>
                </DialogTrigger>
                <RecruitmentForm language={language} />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'destructive'}
                    disabled={error !== null || positions.length <= 1}
                    title='Remove a position from the committee'
                  >
                    <TrashIcon className='w-5 h-5 mr-2' />
                    Remove
                  </Button>
                </DialogTrigger>
                <RemovePositionForm language={language} onSuccess={() => {}} />
              </Dialog>
            </CardFooter>
          </Card>
        </div>
        <Card className='relative'>
          <CardHeader>
            <CardTitle>Active Members</CardTitle>
            <CardDescription>
              <BuildingOffice2Icon className='absolute top-6 right-4 w-5 h-5 mr-2' />
              Current members in the committee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Initiated</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.items.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className='flex items-center gap-2'>
                      <StudentTag student={member.student} includeAt={false} />
                    </TableCell>
                    <TableCell>
                      {isLoading ? (
                        <Skeleton className='w-32 h-8' />
                      ) : (
                        findPosition(member.committee_position_id) && (
                          <p>
                            {
                              findPosition(member.committee_position_id)!
                                .translations[0].title
                            }
                          </p>
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(member.initiation_date).toLocaleDateString(
                        language,
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        }
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant={'outline'}
                        size={'icon'}
                        title='View member'
                      >
                        <Cog6ToothIcon className='w-5 h-5' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className='flex gap-4 flex-wrap'>
          <Card className='w-96 relative'>
            <CardHeader>
              <CardTitle>Positions</CardTitle>
              <CardDescription>
                <CircleStackIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                All positions in the committee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='flex flex-col gap-1'>
                {positions
                  .sort((a, b) => a.weight - b.weight)
                  .map((position, index) => (
                    <li
                      key={index}
                      className='even:bg-neutral-100 even:dark:bg-neutral-800 rounded-md p-2 uppercase font-mono text-sm even:dark:hover:bg-neutral-800 even:hover:bg-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    >
                      <p>{position.translations[0].title}</p>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className='relative grow min-w-[875px]'>
            <CardHeader>
              <CardTitle>Active Recruitment</CardTitle>
              <CardDescription>
                <BuildingOffice2Icon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Currently recruiting positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recruitments.map((recruitment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {recruitment.committee_position.translations[0].title}
                      </TableCell>
                      <TableCell>
                        {new Date(recruitment.start_date).toLocaleDateString(
                          language,
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(recruitment.end_date).toLocaleDateString(
                          language,
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          }
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant={'outline'}
                          size={'icon'}
                          title='View recruitment'
                        >
                          <Cog6ToothIcon className='w-5 h-5' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
