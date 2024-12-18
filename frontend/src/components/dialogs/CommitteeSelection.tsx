'use client'

import { useTranslation } from '@/app/i18n/client'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Committee from '@/models/Committee'
import { LanguageCode } from '@/models/Language'
import { useAuthentication } from '@/providers/AuthenticationProvider'

interface Props {
  language: LanguageCode
  callback: (committee: Committee) => void
}

export default function CommitteeSelection({ language, callback }: Props) {
  const { committees } = useAuthentication()
  const { t } = useTranslation(language, 'media')

  if (committees.length === 0) {
    return
  }

  if (committees.length === 1) {
    callback(committees[0])
    return
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('select_committee')}</DialogTitle>
        <DialogDescription>
          {t('select_committee.description')}
        </DialogDescription>
      </DialogHeader>
      <RadioGroup>
        {committees.map((committee) => (
          <div key={committee.committee_id} className='flex gap-2 items-center'>
            <RadioGroupItem
              value={committee.committee_id}
              onClick={() => callback(committee)}
              id={committee.committee_id}
            />
            <Label htmlFor={committee.committee_id}>
              {committee.translations[0].title}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </DialogContent>
  )
}
