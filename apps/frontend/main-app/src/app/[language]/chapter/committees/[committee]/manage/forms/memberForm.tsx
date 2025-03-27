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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
import { removeMember } from '@/schemas/committee/member'
import {
  ChevronUpDownIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  language: LanguageCode
}

export function RemoveMemberForm({ language }: Props) {
  const { committee, members, positions } = useCommitteeManagement()
  const { student } = useStudent()
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  const { t } = useTranslation(language, 'committee_management/forms/member')
  const form = useForm<z.infer<typeof removeMember>>({
    resolver: zodResolver(removeMember),
    defaultValues: {
      students: [],
      committee_position_id: '',
    },
  })

  const publish = async (data: z.infer<typeof removeMember>) => {
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
      <form
        className='flex flex-col gap-2'
        onSubmit={form.handleSubmit(publish)}
      >
        <Form {...form}>
          {selectedStudents
            .map((student) => student.email)
            .includes(student.email) && (
            <p className='text-sm text-red-500'>{t('remove_self_error')}</p>
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
              form.setValue(
                'committee_position_id',
                members.items.find(
                  (member) => member.student.email === student.email
                )?.committee_position_id ?? ''
              )
              form.setValue(
                'students',
                selectedStudents.map((student) => ({
                  student_email: student.email ?? '',
                }))
              )
            }}
          >
            <MinusIcon className='w-5 h-5 mr-2' />
            {t('remove_button')}
          </Button>
        </Form>
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

  const Schema = z.object({
    students: z
      .array(
        z.object({
          student_email: z.string().email(),
        })
      )
      .min(1),
    position_id: z.string().uuid().optional().or(z.literal('')),
  })

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      students: [],
      position_id: '',
    },
  })

  const publish = async (data: z.infer<typeof Schema>) => {
    const json_data = JSON.stringify(data)
    try {
      const response = await fetch(
        `/api/committee_positions/assign/${data.position_id}`,
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
      <SearchStudent
        language={language}
        onClickCallback={(student) => {
          setSelectedStudents([...selectedStudents, student])
        }}
      />
      <form
        className='flex flex-col gap-2'
        onSubmit={form.handleSubmit(publish)}
      >
        <Form {...form}>
          <FormField
            name='position_id'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-0.5'>
                <FormLabel htmlFor='position_id'>
                  {t('add_member_position_label')}
                </FormLabel>
                <Popover open={open} onOpenChange={setOpen} modal={open}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        // biome-ignore lint/a11y/useSemanticElements: This is a shadcn/ui component for a combobox
                        role='combobox'
                        aria-expanded={open}
                        className='w-[300px] justify-between'
                      >
                        {field.value
                          ? positionOptions.find((o) => o.value === value)
                              ?.label
                          : t('add_member_position_placeholder')}
                        <ChevronUpDownIcon className='w-5 h-5' />
                      </Button>
                    </FormControl>
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
                                form.setValue('position_id', option.value)
                                setValue(
                                  currentValue === value ? '' : currentValue
                                )
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={selectedStudents.length === 0}
            onClick={() => {
              form.setValue(
                'students',
                selectedStudents.map((student) => ({
                  student_email: student.email ?? '',
                }))
              )
            }}
          >
            <PlusIcon className='w-5 h-5 mr-2' />
            {t('add_member_button')}
          </Button>
        </Form>
      </form>
    </DialogContent>
  )
}
