'use client'

import { useTranslation } from '@/app/i18n/client'
import SearchStudent from '@/components/dialogs/SearchStudent'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { LanguageCode } from '@/models/Language'
import { Role } from '@/models/Permission'
import type Student from '@/models/Student'
import { useStudent } from '@/providers/AuthenticationProvider'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { addMember, removeMember } from '@/schemas/committee/member'
import {
  ChevronUpDownIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { z } from 'zod/v4-mini'

interface Props {
  language: LanguageCode
}

export function RemoveMemberForm({ language }: Props) {
  const { committee, members, positions } = useCommitteeManagement()
  const { student } = useStudent()
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  const { t } = useTranslation(language, 'committee_management/forms/member')
  const [form, setForm] = useState<z.infer<typeof removeMember>>({
    committee_position_id: '',
    students: [],
  })
  const [formErrors, setFormErrors] = useState({
    committee_position_id: '',
    students: '',
  })

  const submit = async (data: z.infer<typeof removeMember>) => {
    const errors = removeMember.safeParse(data)
    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        committee_position_id:
          fieldErrors.properties?.committee_position_id?.errors[0] || '',
        students: fieldErrors.properties?.students?.errors[0] || '',
      })
      return
    }

    const { committee_position_id, students } = data
    try {
      const response = await fetch(
        `/api/committee_positions/assign/${committee_position_id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            students,
          }),
        }
      )

      if (response.ok) {
        window.location.reload()
      } else {
        throw new Error('Failed to remove member')
      }
    } catch (_) {
      alert('Failed to remove member')
    }
  }

  const findPosition = (id: string) => {
    return positions.find((position) => position.committee_position_id === id)
  }

  if (!committee) {
    return null
  }

  if (!student) {
    return null
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('remove_member_title')}</DialogTitle>
        <DialogDescription>{t('remove_member_description')}</DialogDescription>
      </DialogHeader>
      <div>
        <SearchStudent
          language={language}
          studentsOrMetadata={{
            metadata: members.items.map((member) => {
              return {
                student: member.student,
                metadataKey:
                  findPosition(member.committee_position_id)?.translations[0]
                    .title || member.committee_position_id,
              }
            }),
          }}
          onClickCallback={(student) => {
            if (selectedStudents.includes(student)) {
              setSelectedStudents(
                selectedStudents.filter((s) => s.email !== student.email)
              )
            } else {
              setSelectedStudents([...selectedStudents, student])
            }
          }}
        />
        {formErrors.students && (
          <p className='text-sm text-red-500'>{formErrors.students}</p>
        )}
      </div>

      <form
        className='flex flex-col gap-2'
        onSubmit={(e) => {
          e.preventDefault()
          submit(form as z.infer<typeof removeMember>)
        }}
      >
        {selectedStudents
          .map((student) => student.email)
          .includes(student.email) && (
          <p className='text-sm text-red-500'>{t('remove_self_error')}</p>
        )}

        {formErrors.committee_position_id && (
          <p className='text-sm text-red-500'>
            {formErrors.committee_position_id}
          </p>
        )}

        <Button
          type='submit'
          variant={'destructive'}
          disabled={
            selectedStudents.length === 0 ||
            selectedStudents
              .map((student) => student.email)
              .includes(student.email)
          }
          onClick={() => {
            setForm({
              committee_position_id:
                members.items.find(
                  (member) => member.student.email === student.email
                )?.committee_position_id ?? '',
              students: selectedStudents.map((student) => ({
                student_email: student.email ?? '',
              })),
            })
          }}
        >
          <MinusIcon className='w-5 h-5 mr-2' />
          {t('remove_button')}
        </Button>
      </form>
    </DialogContent>
  )
}

export function AddMemberForm({
  language,
  onSuccess,
}: {
  language: LanguageCode
  onSuccess: () => void
}) {
  const { positions } = useCommitteeManagement()
  const { positions: studentPositions, role } = useStudent()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const { t } = useTranslation(language, 'committee_management/forms/member')
  const [form, setForm] = useState<z.infer<typeof addMember>>({
    committee_position_id: '',
    students: [],
  })
  const [formErrors, setFormErrors] = useState({
    committee_position_id: '',
    students: '',
  })

  const findPosition = (id: string) => {
    return positions.find((position) => position.committee_position_id === id)
  }

  const positionOptions = positions
    .filter((position) => {
      if (role === Role.ADMIN) return true
      if (!studentPositions) return false
      if (studentPositions.length === 0) return false

      // Find all relevant positions for the student
      const positions = studentPositions
        .map((studentPosition) =>
          findPosition(studentPosition.committee_position_id)
        )
        .filter((position) => position !== undefined)

      if (positions.length === 0) {
        return false
      }

      // Find students highest position (position with highest weight)
      const studentHighestPosition = positions.reduce((prev, current) =>
        prev.weight > current.weight ? prev : current
      )

      // Remove positions with higher weight than the student's highest position
      return position.weight > studentHighestPosition.weight
    })
    .sort((a, b) => a.weight - b.weight)
    .map((position) => ({
      label: position.translations[0].title,
      value: position.committee_position_id,
    }))

  const submit = async (data: z.infer<typeof addMember>) => {
    const errors = addMember.safeParse(data)
    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        committee_position_id:
          fieldErrors.properties?.committee_position_id?.errors[0] || '',
        students: fieldErrors.properties?.students?.errors[0] || '',
      })
      return
    }

    const json_data = JSON.stringify(data)
    try {
      const response = await fetch(
        `/api/committee_positions/assign/${data.committee_position_id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: json_data,
        }
      )

      if (response.ok) {
        onSuccess()
      } else {
        console.error('error')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('add_member_title')}</DialogTitle>
        <DialogDescription>{t('add_member_description')}</DialogDescription>
      </DialogHeader>
      <div>
        <SearchStudent
          language={language}
          onClickCallback={(student) => {
            setSelectedStudents([...selectedStudents, student])
          }}
        />
        {formErrors.students && (
          <p className='text-sm text-red-500'>{formErrors.students}</p>
        )}
      </div>
      <form
        className='flex flex-col gap-2'
        onSubmit={(e) => {
          e.preventDefault()
          submit(form)
        }}
      >
        <div>
          <Label htmlFor='committee_position_id'>
            {t('add_member_position_label')}
          </Label>
          <Popover open={open} onOpenChange={setOpen} modal={open}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                role='combobox'
                aria-expanded={open}
                className='w-[300px] justify-between'
              >
                {form.committee_position_id
                  ? positionOptions.find((o) => o.value === value)?.label
                  : t('add_member_position_placeholder')}
                <ChevronUpDownIcon className='w-5 h-5' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandInput />
                <CommandList>
                  <CommandEmpty>
                    {t('add_member_position_not_found')}
                  </CommandEmpty>
                  <CommandGroup>
                    {positionOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          setForm({
                            ...form,
                            committee_position_id: option.value,
                          })
                          setValue(currentValue === value ? '' : currentValue)
                          setOpen(false)
                        }}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {formErrors.committee_position_id && (
            <p className='text-sm text-red-500'>
              {formErrors.committee_position_id}
            </p>
          )}
        </div>

        <Button
          type='submit'
          disabled={selectedStudents.length === 0}
          onClick={() => {
            setForm({
              ...form,
              students: selectedStudents.map((student) => ({
                student_email: student.email ?? '',
              })),
            })
          }}
        >
          <PlusIcon className='w-5 h-5 mr-2' />
          {t('add_member_button')}
        </Button>
      </form>
    </DialogContent>
  )
}
