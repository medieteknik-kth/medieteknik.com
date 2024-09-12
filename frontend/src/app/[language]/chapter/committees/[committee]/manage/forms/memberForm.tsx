'use client'
import SearchStudent from '@/components/dialogs/SearchStudent'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Student from '@/models/Student'
import {
  ChevronUpDownIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { API_BASE_URL } from '@/utility/Constants'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { Role } from '@/models/Permission'

export function RemoveMemberForm({ language }: { language: string }) {
  const { committee, members } = useCommitteeManagement()
  const Schema = z.object({
    students: z
      .array(
        z.object({
          student_email: z.string().email(),
        })
      )
      .min(1),
  })

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      students: [],
    },
  })

  if (!committee) {
    return null
  }

  const publish = async (data: z.infer<typeof Schema>) => {
    const json_data = JSON.stringify(data)
    try {
      const response = await fetch(
        `${API_BASE_URL}/committee_positions/assign`,
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
        console.log('success')
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
        <DialogTitle>Remove new member</DialogTitle>
        <DialogDescription>
          Select a student to add to the committee
        </DialogDescription>
      </DialogHeader>
      <SearchStudent
        students={[...members.items.map((member) => member.student)]}
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
          <Button
            type='submit'
            variant={'destructive'}
            disabled={selectedStudents.length === 0}
            onClick={() => {
              form.setValue(
                'students',
                selectedStudents.map((student) => ({
                  student_email: student.email,
                }))
              )
            }}
          >
            <MinusIcon className='w-5 h-5 mr-2' />
            Remove
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
  language: string
  onSuccess: () => void
}) {
  const { positions } = useCommitteeManagement()
  const { positions: studentPositions, role } = useAuthentication()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

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
        `${API_BASE_URL}/committee_positions/assign`,
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
        <DialogTitle>Add a new member</DialogTitle>
        <DialogDescription>
          Select a student to add to the committee
        </DialogDescription>
      </DialogHeader>
      <SearchStudent
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
                <FormLabel htmlFor='position_id'>Position</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        role='combobox'
                        aria-expanded={open}
                        className='w-[300px] justify-between'
                      >
                        {field.value
                          ? positionOptions.find((o) => o.value === value)
                              ?.label
                          : 'Select a position'}
                        <ChevronUpDownIcon className='w-5 h-5' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput />
                      <CommandList>
                        <CommandEmpty>No positions found</CommandEmpty>
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
                  student_email: student.email,
                }))
              )
            }}
          >
            <PlusIcon className='w-5 h-5 mr-2' />
            Add
          </Button>
        </Form>
      </form>
    </DialogContent>
  )
}
