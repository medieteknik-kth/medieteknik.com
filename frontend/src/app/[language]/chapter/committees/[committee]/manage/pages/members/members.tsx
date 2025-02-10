'use client'

import CurrentMembers from '@/app/[language]/chapter/committees/[committee]/manage/pages/members/currentMembers'
import {
  WeightLevel,
  hasMinimumWeightRequirement,
} from '@/app/[language]/chapter/committees/[committee]/manage/pages/members/util'
import { useTranslation } from '@/app/i18n/client'
import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { API_BASE_URL } from '@/utility/Constants'
import {
  BuildingOffice2Icon,
  CircleStackIcon,
  ClockIcon,
  IdentificationIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { type JSX, useEffect, useState } from 'react'
import { AddMemberForm, RemoveMemberForm } from '../../forms/memberForm'
import PositionForm from '../../forms/positionForm'
import RecruitmentForm from '../../forms/recruitmentForm'
import RemovePositionForm from '../../forms/removePosition'

interface Props {
  language: LanguageCode
  committee: Committee
}

/**
 * @name MembersPage
 * @description The page for managing a committees members
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 * @param {Committee} props.committee - The committee data
 *
 * @returns {JSX.Element} The rendered component
 */
export default function MembersPage({
  committee,
  language,
}: Props): JSX.Element {
  // TODO: Clean-up the code, separate the components into smaller components?
  const [isLoading, setIsLoading] = useState(true)
  const [addPositionOpen, setAddPositionOpen] = useState(false)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [recruitmentOpen, setRecruitmentOpen] = useState(false)
  const {
    members,
    positions,
    isLoading: isLoadingMembers,
    error,
    recruitments,
    addPosition,
  } = useCommitteeManagement()
  const { positions: studentPositions, role } = useAuthentication()
  const { t } = useTranslation(language, 'committee_management/members')

  const deleteRecruitment = async (id: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/committee_positions/${id}/recruit`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        alert('Failed to delete recruitment')
        throw new Error('Failed to delete recruitment')
      }
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!isLoadingMembers) {
      setIsLoading(false)
    }
  }, [isLoadingMembers])

  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400 tracking-wide'>
        {t('title')}
      </h2>
      <div className='flex flex-col mt-4 gap-4'>
        <div className='flex flex-wrap gap-4'>
          <Card className='w-fit relative'>
            <CardHeader>
              <CardTitle>{t('members')}</CardTitle>
              <CardDescription>
                <UsersIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                {t('members.description')}
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
              <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant={'outline'}
                    disabled={
                      error !== null ||
                      !hasMinimumWeightRequirement(
                        positions,
                        studentPositions,
                        role,
                        WeightLevel.HIGH
                      )
                    }
                    title='Add a new member to the committee'
                  >
                    <PlusIcon className='w-5 h-5 mr-2' />
                    {t('members.add')}
                  </Button>
                </DialogTrigger>
                <AddMemberForm
                  language={language}
                  onSuccess={() => {
                    setAddMemberOpen(false)
                    window.location.reload()
                  }}
                />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'destructive'}
                    disabled={
                      members.total_items === 0 ||
                      error !== null ||
                      !hasMinimumWeightRequirement(
                        positions,
                        studentPositions,
                        role,
                        WeightLevel.HIGHEST
                      )
                    }
                    title='Remove a member from the committee'
                  >
                    <TrashIcon className='w-5 h-5 mr-2' />
                    {t('members.remove')}
                  </Button>
                </DialogTrigger>
                <RemoveMemberForm language={language} />
              </Dialog>
            </CardFooter>
          </Card>

          <Card className='w-fit relative mr-4'>
            <CardHeader>
              <CardTitle>{t('positions')}</CardTitle>
              <CardDescription>
                <IdentificationIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                {t('positions.description')}
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
                    disabled={
                      error !== null ||
                      !hasMinimumWeightRequirement(
                        positions,
                        studentPositions,
                        role,
                        WeightLevel.HIGH
                      )
                    }
                    title='Create a new position to the committee'
                  >
                    <PlusIcon className='w-5 h-5 mr-2' />
                    {t('positions.add')}
                  </Button>
                </DialogTrigger>
                <PositionForm
                  committee={committee}
                  language={language}
                  onSuccess={(position) => {
                    addPosition(position)
                    setAddPositionOpen(false)
                    window.location.reload()
                  }}
                />
              </Dialog>

              <Dialog open={recruitmentOpen} onOpenChange={setRecruitmentOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant={'outline'}
                    className='mr-4'
                    disabled={
                      error !== null ||
                      positions.length === 0 ||
                      !hasMinimumWeightRequirement(
                        positions,
                        studentPositions,
                        role,
                        WeightLevel.MEDIUM
                      )
                    }
                    title='Open a position for recruitment'
                  >
                    <ClockIcon className='w-5 h-5 mr-2' />
                    {t('positions.recruit')}
                  </Button>
                </DialogTrigger>
                {!isLoading && (
                  <RecruitmentForm
                    language={language}
                    onSuccess={() => {
                      setRecruitmentOpen(false)
                      window.location.reload()
                    }}
                  />
                )}
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'destructive'}
                    disabled={
                      error !== null ||
                      positions.length <= 1 ||
                      !hasMinimumWeightRequirement(
                        positions,
                        studentPositions,
                        role,
                        WeightLevel.HIGHEST
                      )
                    }
                    title='Remove a position from the committee'
                  >
                    <TrashIcon className='w-5 h-5 mr-2' />
                    {t('positions.remove')}
                  </Button>
                </DialogTrigger>
                <RemovePositionForm language={language} onSuccess={() => {}} />
              </Dialog>
            </CardFooter>
          </Card>
        </div>
        <Accordion type='multiple' defaultValue={['current_members']}>
          <CurrentMembers language={language} />
        </Accordion>
        <div className='flex gap-4 flex-wrap'>
          <Card className='w-96 relative'>
            <CardHeader>
              <CardTitle>{t('positions')}</CardTitle>
              <CardDescription>
                <CircleStackIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                {t('positions.view')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='flex flex-col gap-1'>
                {positions
                  .sort((a, b) => a.weight - b.weight)
                  .map((position) => (
                    <li
                      key={position.committee_position_id}
                      className='even:bg-neutral-100 dark:even:bg-neutral-800 rounded-md p-2 uppercase font-mono text-sm dark:even:hover:bg-neutral-800 even:hover:bg-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    >
                      <p>{position.translations[0].title}</p>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className='relative grow xl:min-w-[875px]'>
            <CardHeader>
              <CardTitle>{t('recruitments')}</CardTitle>
              <CardDescription>
                <BuildingOffice2Icon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                {t('recruitments.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('position')}</TableHead>
                    <TableHead>{t('recruitments.start_date')}</TableHead>
                    <TableHead>{t('recruitments.end_date')}</TableHead>
                    <TableHead className='text-right'>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recruitments.map((recruitment) => (
                    <TableRow
                      key={`${recruitment.committee_position.committee_position_id}_${recruitment.start_date.toString()}`}
                    >
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
                          variant={'destructive'}
                          size={'icon'}
                          title='Delete recruitment'
                          onClick={() =>
                            deleteRecruitment(
                              recruitment.committee_position
                                .committee_position_id
                            )
                          }
                        >
                          <TrashIcon className='w-5 h-5' />
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
