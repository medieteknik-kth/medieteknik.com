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
import { FormControl } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import { useCommitteeManagement } from '@/providers/CommitteeManagementProvider'
import { removePositionSchema } from '@/schemas/committee/position'
import { ChevronUpDownIcon, MinusIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import { z } from 'zod/v4-mini'

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
  const [form, setForm] = useState<z.infer<typeof removePositionSchema>>({
    committee_position_id: '',
  })
  const [formErrors, setFormErrors] = useState({
    committee_position_id: '',
  })

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

  const submit = async (data: z.infer<typeof removePositionSchema>) => {
    if (containsOwnPosition) {
      return
    }

    const errors = removePositionSchema.safeParse(data)

    if (!errors.success) {
      const fieldErrors = z.treeifyError(errors.error)
      setFormErrors({
        committee_position_id:
          fieldErrors.properties?.committee_position_id?.errors[0] || '',
      })
    }

    const json_data = JSON.stringify(data)

    try {
      const response = await fetch(
        `/api/committee_positions/${data.committee_position_id}`,
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
        <DialogTitle>{t('title')}</DialogTitle>
        <DialogDescription>{t('description')}</DialogDescription>
      </DialogHeader>
      <form
        className='flex flex-col gap-2'
        onSubmit={(e) => {
          e.preventDefault()
          submit(form)
        }}
      >
        <div>
          <Label className='text-sm font-semibold'>{t('label')}</Label>
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
                    : t('placeholder')}
                  <ChevronUpDownIcon className='w-5 h-5' />
                </Button>
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
                          setForm({
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
            <p className='text-red-500 text-xs'>
              {formErrors.committee_position_id}
            </p>
          )}
        </div>

        <Button
          type='submit'
          variant={'destructive'}
          disabled={value === '' || containsOwnPosition}
        >
          <MinusIcon className='w-5 h-5 mr-2' />
          {t('remove_button')}
        </Button>
      </form>
    </DialogContent>
  )
}
