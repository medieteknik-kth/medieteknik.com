'use client'
import { useTranslation } from '@/app/i18n/client'
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
import { useStudent } from '@/providers/AuthenticationProvider'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { removePositionSchema } from '@/schemas/committee/position'
import { API_BASE_URL } from '@/utility/Constants'
import { ChevronUpDownIcon, MinusIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

export default function RemovePositionForm({
  language,
  onSuccess,
}: {
  language: LanguageCode
  onSuccess: () => void
}) {
  const { positions } = useCommitteeManagement()
  const { positions: studentPositions } = useStudent()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const { t } = useTranslation(language, 'committee_management/forms/remove')

  const positionOptions = positions
    .filter((position) => {
      return !position.base
    })
    .map((position) => ({
      label: position.translations[0].title,
      value: position.committee_position_id,
    }))

  const containsOwnPosition = useMemo(
    () =>
      studentPositions.some(
        (studentPosition) => studentPosition.committee_position_id === value
      ),
    [studentPositions, value]
  )

  const form = useForm<z.infer<typeof removePositionSchema>>({
    resolver: zodResolver(removePositionSchema),
    defaultValues: {
      position_id: '',
    },
  })

  const publish = async (data: z.infer<typeof removePositionSchema>) => {
    if (containsOwnPosition) {
      return
    }

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

  console.log(studentPositions)

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('title')}</DialogTitle>
        <DialogDescription>{t('description')}</DialogDescription>
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
                <FormLabel htmlFor='position_id'>{t('label')}</FormLabel>
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
                          : t('placeholder')}
                        <ChevronUpDownIcon className='w-5 h-5' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput placeholder={t('search_placeholder')} />
                      <CommandList>
                        <CommandEmpty>{t('not_found')}</CommandEmpty>
                        <CommandGroup>
                          {positionOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              disabled={
                                studentPositions.some(
                                  (studentPosition) =>
                                    studentPosition.committee_position_id ===
                                    option.value
                                ) && option.value !== value
                              }
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
            variant={'destructive'}
            disabled={value === '' || containsOwnPosition}
          >
            <MinusIcon className='w-5 h-5 mr-2' />
            {t('remove_button')}
          </Button>
        </Form>
      </form>
    </DialogContent>
  )
}
