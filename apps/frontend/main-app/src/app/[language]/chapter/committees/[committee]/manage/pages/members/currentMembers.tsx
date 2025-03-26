'use client'

import {
  WeightLevel,
  hasMinimumWeightRequirement,
} from '@/app/[language]/chapter/committees/[committee]/manage/pages/members/util'
import { useTranslation } from '@/app/i18n/client'
import StudentTag from '@/components/tags/StudentTag'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'

interface Props {
  language: LanguageCode
}

export default function CurrentMembers({ language }: Props) {
  const { members, positions, isLoading, error } = useCommitteeManagement()
  const { student, positions: studentPositions, role } = useStudent()
  const { t } = useTranslation(language, 'committee_management/members')

  if (!student) {
    return <></>
  }

  const findPosition = (id: string) => {
    return positions.find((position) => position.committee_position_id === id)
  }

  const removeStudent = async (
    student_email: string,
    committee_position_id: string
  ) => {
    const json_data = JSON.stringify({
      students: [{ student_email: student_email }],
    })

    try {
      const response = await fetch(
        `/api/committee_positions/assign/${committee_position_id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: json_data,
        }
      )

      if (response.ok) {
        window.location.reload()
      }
    } catch {
      console.log('error')
    }
  }

  return (
    <AccordionItem value='current_members'>
      <AccordionTrigger className='text-2xl font-semibold leading-none tracking-tight'>
        {t('current_members')}
      </AccordionTrigger>
      <AccordionContent>
        <>
          <p className='text-sm text-muted-foreground mb-4 -mt-1'>
            {t('members.description')}
          </p>
          <Table className='rounded-lg overflow-hidden'>
            <TableHeader>
              <TableRow className='bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'>
                <TableHead>{t('student_name')}</TableHead>
                <TableHead>{t('position')}</TableHead>
                <TableHead>{t('initiation_date')}</TableHead>
                <TableHead
                  className={
                    error !== null ||
                    positions.length <= 1 ||
                    !hasMinimumWeightRequirement(
                      positions,
                      studentPositions,
                      role,
                      WeightLevel.HIGHEST
                    )
                      ? 'hidden'
                      : 'text-right'
                  }
                >
                  {t('actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.items
                .sort((a, b) => {
                  return a.student.first_name.localeCompare(
                    b.student.first_name
                  )
                })
                .sort((a, b) => {
                  const positionA = findPosition(a.committee_position_id)
                  const positionB = findPosition(b.committee_position_id)
                  return (
                    (positionA ? positionA.weight : 0) -
                    (positionB ? positionB.weight : 0)
                  )
                })
                .map((member) => (
                  <TableRow
                    key={`${member.committee_position_id}_${member.student.email}`}
                    className='odd:bg-neutral-100 hover:bg-neutral-200 dark:odd:bg-neutral-800 dark:hover:bg-neutral-700'
                  >
                    <TableCell className='flex items-center gap-2 h-full'>
                      <StudentTag
                        student={member.student}
                        language={language}
                        includeAt={false}
                        includeImage
                      />
                    </TableCell>
                    <TableCell>
                      {isLoading ? (
                        <Skeleton className='w-32 h-8' />
                      ) : (
                        findPosition(member.committee_position_id) && (
                          <p>
                            {
                              findPosition(member.committee_position_id)
                                ?.translations[0].title
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
                    <TableCell
                      className={
                        error !== null ||
                        positions.length <= 1 ||
                        !hasMinimumWeightRequirement(
                          positions,
                          studentPositions,
                          role,
                          WeightLevel.HIGHEST
                        )
                          ? 'hidden'
                          : 'text-right'
                      }
                    >
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={'outline'}
                            size={'icon'}
                            title='View member'
                            disabled={member.student.email === student.email}
                          >
                            <Cog6ToothIcon className='w-5 h-5' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='min-w-48' side='left'>
                          <DropdownMenuLabel className='flex items-center gap-2'>
                            <StudentTag
                              student={member.student}
                              language={language}
                              includeAt={false}
                              includeImage
                            >
                              <p className='text-xs text-muted-foreground'>
                                {findPosition(member.committee_position_id) && (
                                  <span>
                                    {
                                      findPosition(member.committee_position_id)
                                        ?.translations[0].title
                                    }
                                  </span>
                                )}
                              </p>
                            </StudentTag>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Button
                              variant={'destructive'}
                              className='w-full cursor-pointer text-destructive-foreground! hover:bg-destructive/90!'
                              disabled={
                                error !== null ||
                                positions.length <= 1 ||
                                !hasMinimumWeightRequirement(
                                  positions,
                                  studentPositions,
                                  role,
                                  WeightLevel.HIGHEST
                                ) ||
                                member.student.email === student.email
                              }
                              onClick={() =>
                                removeStudent(
                                  member.student.email || '',
                                  member.committee_position_id
                                )
                              }
                            >
                              {t('members.remove')}
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      </AccordionContent>
    </AccordionItem>
  )
}
