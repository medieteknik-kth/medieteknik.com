'use client'

import { useTranslation } from '@/app/i18n/client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FileDisplay from '@/components/ui/file-display'
import type { LanguageCode } from '@medieteknik/models/src/util/Language'

interface Props {
  language: LanguageCode
  files: File[]
}

export default function FileOverview({ language, files }: Props) {
  const { t } = useTranslation(language, 'upload/finalize/files')

  return (
    <Card className='shadow-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold leading-tight flex items-center gap-2'>
          {t('title')}
          <Badge variant='outline' className='ml-1 font-normal'>
            {files.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FileDisplay files={files} preview />
      </CardContent>
    </Card>
  )
}
