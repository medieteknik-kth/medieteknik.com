'use client'

import { useTranslation } from '@/app/i18n/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type Committee from '@/models/Committee'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import { type JSX, useState } from 'react'

interface Props {
  language: LanguageCode
  committees: Committee[] | null
}

export default function CommitteeDialog({
  language,
  committees,
}: Props): JSX.Element {
  const { committees: studentCommittees } = useStudent()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation(language, 'header/committees')
  if (!committees) {
    return <></>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size={'icon'}
          className='col-start-4 flex h-full items-center justify-center'
        >
          <BuildingOffice2Icon className='w-7 h-7' />
        </Button>
      </DialogTrigger>
      {open && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>
          {studentCommittees.length > 0 && (
            <div>
              <h3 className='text-sm font-bold tracking-tight'>
                {t('your_committees')}
              </h3>
              <div className='flex flex-col gap-1 max-h-96 overflow-y-auto'>
                {studentCommittees.map((committee) => (
                  <Button
                    key={committee.committee_id}
                    variant={'ghost'}
                    asChild
                  >
                    <Link
                      href={`/${language}/chapter/committees/${committee.translations[0].title}`}
                      className='flex h-fit justify-start items-center gap-2 pl-0'
                    >
                      <div className='bg-white h-12 w-12 p-1 rounded-lg'>
                        <Image
                          src={committee.logo_url}
                          alt='placeholder'
                          width={48}
                          height={48}
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className='text-sm font-bold tracking-tight'>
                          {committee.translations[0].title}
                        </p>
                        <p className='text-xs text-muted-foreground truncate max-w-[70vw] xs:max-w-[390px]'>
                          {committee.translations[0].description}
                        </p>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className='text-sm font-bold tracking-tight'>
              {t('all_committees')}
            </h3>

            <div
              className={`flex flex-col overflow-y-auto ${studentCommittees.length === 1 ? 'max-h-96' : studentCommittees.length === 2 ? 'max-h-80' : 'max-h-64'}`}
            >
              {committees
                .filter(
                  (committee) =>
                    !studentCommittees.some(
                      (studentCommittee) =>
                        studentCommittee.committee_id === committee.committee_id
                    )
                )
                .sort((a, b) =>
                  a.translations[0].title.localeCompare(b.translations[0].title)
                )
                .map((committee) => (
                  <Button
                    key={committee.committee_id}
                    variant={'ghost'}
                    asChild
                  >
                    <Link
                      href={`/${language}/chapter/committees/${committee.translations[0].title}`}
                      className='flex h-fit justify-start items-center gap-2 pl-0'
                    >
                      <div className='bg-white h-12 w-12 p-1 rounded-lg'>
                        <Image
                          src={committee.logo_url}
                          alt='placeholder'
                          width={48}
                          height={48}
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className='text-sm font-bold tracking-tight'>
                          {committee.translations[0].title}
                        </p>
                        <p className='text-xs text-muted-foreground truncate max-w-[70vw] xs:max-w-[390px]'>
                          {committee.translations[0].description}
                        </p>
                      </div>
                    </Link>
                  </Button>
                ))}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
