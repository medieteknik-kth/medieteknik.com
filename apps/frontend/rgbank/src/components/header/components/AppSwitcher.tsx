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
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import type { LanguageCode } from '@/models/Language'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Logo from 'public/images/logo.webp'

interface Props {
  language: LanguageCode
}

export default function AppSwitcher({ language }: Props) {
  const { t } = useTranslation(language, 'profile')

  return (
    <>
      <div className='hidden md:block'>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='p-0 pr-2'>
              <Button
                className='w-full flex items-center justify-start gap-2 p-0 pl-2'
                variant={'ghost'}
              >
                <Squares2X2Icon className='w-4 h-4' />
                <p>{t('appSwitcher')}</p>
              </Button>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='mr-2 dark:bg-[#111]'>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t('apps')}</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Button variant={'ghost'} className='w-full' asChild>
                      <a
                        href={`https://www.medieteknik.com/${language}`}
                        hrefLang={language}
                        className='h-fit'
                      >
                        <div className='w-full h-full flex items-center gap-2'>
                          <Image
                            src={Logo.src}
                            alt='Medieteknik Logo'
                            width={40}
                            height={40}
                            className='object-cover h-10 w-auto'
                          />
                          <span>{t('medieteknik')}</span>
                        </div>
                      </a>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Button variant={'ghost'} className='w-full' disabled>
                      <div className='w-full h-full flex items-center gap-2'>
                        <Image
                          src={Logo.src}
                          alt='Medieteknik Logo'
                          width={40}
                          height={40}
                          className='object-cover h-10 w-auto'
                        />
                        <span>{t('rgbank')}</span>
                      </div>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </div>

      <div className='md:hidden'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className='w-full flex items-center justify-start gap-2 p-0 pl-2'
              variant={'ghost'}
            >
              <Squares2X2Icon className='w-4 h-4' />
              <p>{t('appSwitcher')}</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('appSwitcher')}</DialogTitle>
              <DialogDescription>
                {t('appSwitcher.description')}
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-2'>
              <Button variant={'ghost'} className='w-full p-0 pl-2' asChild>
                <a
                  href={`https://www.medieteknik.com/${language}`}
                  hrefLang={language}
                >
                  <div className='w-full h-full flex items-center gap-2'>
                    <Image
                      src={Logo.src}
                      alt='Medieteknik Logo'
                      width={64}
                      height={64}
                      className='object-cover h-full w-auto'
                    />
                    <span>{t('medieteknik')}</span>
                  </div>
                </a>
              </Button>

              <Button variant={'ghost'} className='w-full p-0 pl-2' disabled>
                <div className='w-full h-full space-x-2'>
                  <Image
                    src={Logo.src}
                    alt='Medieteknik Logo'
                    width={64}
                    height={64}
                    className='object-cover h-16 aspect-square'
                  />
                  <span>{t('rgbank')}</span>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
