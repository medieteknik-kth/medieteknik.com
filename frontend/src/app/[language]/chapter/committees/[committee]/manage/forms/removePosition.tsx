'use client'
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
import { LanguageCode } from '@/models/Language'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { removePositionSchema } from '@/schemas/committee/position'
import { API_BASE_URL } from '@/utility/Constants'
import { ChevronUpDownIcon, MinusIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function RemovePositionForm({
  language,
  onSuccess,
}: {
  language: LanguageCode
  onSuccess: () => void
}) {
  const { positions } = useCommitteeManagement()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const positionOptions = positions
    .filter((position) => {
      return !position.base
    })
    .map((position) => ({
      label: position.translations[0].title,
      value: position.committee_position_id,
    }))

  const form = useForm<z.infer<typeof removePositionSchema>>({
    resolver: zodResolver(removePositionSchema),
    defaultValues: {
      position_id: '',
    },
  })

  const publish = async (data: z.infer<typeof removePositionSchema>) => {
    const json_data = JSON.stringify(data)

    try {
      const response = await fetch(
        `${API_BASE_URL}/committee_positions/${data.position_id}`,
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
        onSuccess()
      }
    } catch {
      console.log('error')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Remove position</DialogTitle>
        <DialogDescription>
          Select a position to remove from the committee
        </DialogDescription>
      </DialogHeader>
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
          <Button type='submit' variant={'destructive'} disabled={value === ''}>
            <MinusIcon className='w-5 h-5 mr-2' />
            Remove
          </Button>
        </Form>
      </form>
    </DialogContent>
  )
}
