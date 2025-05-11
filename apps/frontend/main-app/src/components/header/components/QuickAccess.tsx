'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { LanguageCode } from '@/models/Language'
import { useStudent } from '@/providers/AuthenticationProvider'
import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  HomeIcon,
  InformationCircleIcon,
  Squares2X2Icon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { PinIcon, PinOff } from 'lucide-react'
import { Link } from 'next-view-transitions'
import type { JSX } from 'react'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  language: LanguageCode
}

interface NavigationButton {
  name: string
  icon: JSX.Element
  href: string
  isPinned: boolean
}

interface ButtonProps {
  button: NavigationButton
  toggleDialog: () => void
  togglePin: () => void
}

const LOCAL_STORAGE_KEY = 'pinnedButtons'

function QuickAccessButton({ button, toggleDialog, togglePin }: ButtonProps) {
  return (
    <div>
      <Button
        className={`w-full h-16 flex flex-col items-center justify-center gap-1 p-2 ${button.isPinned ? 'border-primary' : ''}`}
        variant={'outline'}
        title={button.name}
        aria-label={button.name}
        onClick={() => toggleDialog()}
        asChild
      >
        <Link href={button.href} className=''>
          {button.icon}
          <span className='text-xs font-medium truncate max-w-full'>
            {button.name}
          </span>
        </Link>
      </Button>
      <Button
        className='w-full flex items-center justify-center gap-1 py-1"'
        variant={'ghost'}
        size={'sm'}
        onClick={() => {
          togglePin()
        }}
      >
        {button.isPinned ? (
          <>
            <PinOff className='w-3 h-3' />
            <span className='text-xs'>Unpin</span>
          </>
        ) : (
          <>
            <PinIcon className='w-3 h-3' />
            <span className='text-xs'>Pin</span>
          </>
        )}
      </Button>
    </div>
  )
}

/**
 * @name QuickAccessMenu
 * @description A component that provides quick access to various features of the application.
 * It displays a dialog with pinned and unpinned buttons for navigation. This (for now) only works on mobile/smaller screens.
 * @param {Props} props - The component props
 * @param {LanguageCode} props.language - The current language of the application
 * @returns {JSX.Element} The QuickAccessMenu component
 */
export default function QuickAccessMenu({ language }: Props): JSX.Element {
  const [openDialog, setOpenDialog] = useState(false)
  const { student } = useStudent()
  const [buttons, setButtons] = useState<NavigationButton[]>([
    {
      name: 'Home',
      icon: <HomeIcon className='w-5 h-5' />,
      href: `/${language}`,
      isPinned: true,
    },
    {
      name: 'Bulletin',
      icon: <CalendarDaysIcon className='w-5 h-5' />,
      href: `/${language}/bulletin`,
      isPinned: true,
    },
    {
      name: 'Documents',
      icon: <DocumentTextIcon className='w-5 h-5' />,
      href: `/${language}/chapter/documents`,
      isPinned: true,
    },
    {
      name: 'Chapter',
      icon: <BuildingOffice2Icon className='w-5 h-5' />,
      href: `/${language}/chapter`,
      isPinned: false,
    },
    {
      name: 'Graphical Identity',
      icon: <HomeIcon className='w-5 h-5' />,
      href: `/${language}/chapter/graphic`,
      isPinned: false,
    },
    {
      name: 'Education',
      icon: <AcademicCapIcon className='w-5 h-5' />,
      href: `/${language}/education`,
      isPinned: false,
    },
    {
      name: 'Privacy Policy',
      icon: <InformationCircleIcon className='w-5 h-5' />,
      href: `/${language}/privacy`,
      isPinned: false,
    },
    {
      name: 'Equality',
      icon: <ClipboardDocumentListIcon className='w-5 h-5' />,
      href: `/${language}/chapter/equality`,
      isPinned: false,
    },
    {
      name: 'Contact',
      icon: <InformationCircleIcon className='w-5 h-5' />,
      href: `/${language}/contact`,
      isPinned: false,
    },
  ])

  const pinButton = useCallback((buttonName: string) => {
    // Update the state and localStorage to pin the button
    setButtons((prev) =>
      prev.map((button) =>
        button.name === buttonName ? { ...button, isPinned: true } : button
      )
    )
    // Add the button name to an array in localStorage
    const pinnedButtons = localStorage.getItem(LOCAL_STORAGE_KEY)
    const parsedButtons = pinnedButtons ? JSON.parse(pinnedButtons) : []
    const updatedButtons = parsedButtons.map(
      (button: {
        buttonName: string
        isPinned: boolean
      }) =>
        button.buttonName === buttonName
          ? { buttonName, isPinned: true }
          : button
    )
    if (
      !updatedButtons.some(
        (button: {
          buttonName: string
          isPinned: boolean
        }) => button.buttonName === buttonName
      )
    ) {
      updatedButtons.push({ buttonName, isPinned: true })
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedButtons))
  }, [])

  const unpinButton = useCallback((buttonName: string) => {
    setButtons((prev) =>
      prev.map((button) =>
        button.name === buttonName ? { ...button, isPinned: false } : button
      )
    )
    const pinnedButtons = localStorage.getItem(LOCAL_STORAGE_KEY)
    const parsedButtons = pinnedButtons ? JSON.parse(pinnedButtons) : []
    const updatedButtons = parsedButtons.map(
      (button: {
        buttonName: string
        isPinned: boolean
      }) =>
        button.buttonName === buttonName
          ? { buttonName, isPinned: false }
          : button
    )
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedButtons))
  }, [])

  useEffect(() => {
    const pinnedButtons = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!pinnedButtons) {
      const defaultPins = buttons.map((button) => ({
        buttonName: button.name,
        isPinned: button.isPinned,
      }))
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultPins))
    }
  }, [buttons])

  useEffect(() => {
    if (!window) return

    const pinnedButtons = localStorage.getItem('pinnedButtons')

    if (pinnedButtons) {
      const parsedButtons = JSON.parse(pinnedButtons)
      setButtons((prevButtons) => {
        const updatedButtons = prevButtons.map((button) => {
          const pinnedButton = parsedButtons.find(
            (p: { buttonName: string }) => p.buttonName === button.name
          )
          return {
            ...button,
            isPinned: pinnedButton ? pinnedButton.isPinned : button.isPinned,
          }
        })
        if (student) {
          return [
            ...updatedButtons,
            {
              name: 'Account',
              icon: <UserIcon className='w-5 h-5' />,
              href: `/${language}/account`,
              isPinned: false,
            },
          ]
        }
        return updatedButtons
      })
    }
  }, [student, language])

  const pinnedButtons = buttons.filter((button) => button.isPinned)
  const unpinnedButtons = buttons.filter((button) => !button.isPinned)

  return (
    <>
      <Button
        variant={'defaultOutline'}
        size={'icon'}
        className='rounded-full md:hidden overflow-hidden h-[4.5rem] w-[4.5rem] flex items-center hover:opacity-100 transition-opacity duration-500 ease-in-out'
        title={'Quick Access'}
        aria-label='Search Button'
        onClick={() => setOpenDialog(!openDialog)}
      >
        <Squares2X2Icon className='w-7 md:w-4 h-7 md:h-4' />
      </Button>
      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className='sm:max-w-md max-w-[95vw]'>
            <DialogHeader>
              <DialogTitle>Quick Access</DialogTitle>
              <VisuallyHidden>
                <DialogDescription>
                  Access various features quickly and easily.
                </DialogDescription>
              </VisuallyHidden>
            </DialogHeader>

            <div className='flex flex-col gap-4'>
              {pinnedButtons.length > 0 && (
                <div className='space-y-2'>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    Pinned
                  </h3>
                  <ScrollArea className='h-[190px] pr-4'>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                      {pinnedButtons.map((button) => (
                        <QuickAccessButton
                          key={button.name}
                          button={button}
                          toggleDialog={() => setOpenDialog(false)}
                          togglePin={() =>
                            button.isPinned
                              ? unpinButton(button.name)
                              : pinButton(button.name)
                          }
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
              {pinnedButtons.length > 0 && unpinnedButtons.length > 0 && (
                <Separator />
              )}

              {unpinnedButtons.length > 0 && (
                <div className='space-y-2'>
                  <h3 className='text-sm font-medium text-muted-foreground'>
                    All
                  </h3>
                  <ScrollArea className='h-[250px] pr-4'>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                      {unpinnedButtons.map((button) => (
                        <QuickAccessButton
                          key={button.name}
                          button={button}
                          toggleDialog={() => setOpenDialog(false)}
                          togglePin={() =>
                            button.isPinned
                              ? unpinButton(button.name)
                              : pinButton(button.name)
                          }
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
