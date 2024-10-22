'use client'

import { Button } from '@/components/ui/button'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LockClosedIcon,
  LockOpenIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Dispatch, JSX, SetStateAction, useEffect, useState } from 'react'
import { AccountPages, Tabs } from './account'

interface Props {
  accountPages: AccountPages[]
  currentTab: Tabs | null
  setCurrentTab: Dispatch<SetStateAction<Tabs | null>>
}

/**
 * @name Sidebar
 * @description The component that renders the sidebar for the account page
 *
 * @param {Props} props
 * @param {AccountPages[]} props.accountPages - The pages to display in the sidebar
 * @param {Tabs | null} props.currentTab - The current tab
 * @param {Dispatch<SetStateAction<Tabs | null>>} props.setCurrentTab - The function to set the current tab
 *
 * @returns {JSX.Element} The sidebar
 */
export default function Sidebar({
  accountPages,
  currentTab,
  setCurrentTab,
}: Props): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [smallScreen, setSmallScreen] = useState(false)

  const router = useRouter()
  const params = useSearchParams()
  const path = usePathname()

  useEffect(() => {
    const tab = params.get('category')
    setCurrentTab((tab as Tabs) || 'account')
  }, [params, setCurrentTab])

  useEffect(() => {
    const handleResize = () => {
      if (isExpanded) {
        setIsHidden(false)
        return
      }
      if (window.innerWidth < 768) {
        setSmallScreen(true)
        setIsHidden(true)
      } else if (window.innerWidth >= 768 && isHidden) {
        setSmallScreen(false)
        setIsHidden(false)
      }
    }
    window.addEventListener('resize', handleResize)
  })

  const handleTabChange = (tabName: Tabs) => {
    setCurrentTab(tabName)

    router.push(path + '?' + new URLSearchParams({ category: tabName }))
  }

  const updateExpandMenu = (value: boolean) => {
    if (isLocked) return
    if (isHidden) return
    setIsExpanded(value)
  }

  const updateHideMenu = (value: boolean) => {
    if (isLocked) return
    if (value === true) setIsExpanded(false)
    setIsHidden(value)
  }

  return (
    <div
      className={`${isExpanded ? 'w-full md:w-48' : isHidden ? 'w-0' : 'w-24'}
      min-h-[1080px] h-full bg-white dark:bg-[#111] absolute left-0 border-r-2 z-20 border-neutral-300 dark:border-neutral-800 transition-all`}
      onClick={() => {
        if (smallScreen) {
          if (isExpanded) {
            setIsExpanded(false)
            setIsHidden(true)
          } else {
            updateExpandMenu(!isExpanded)
          }
        }
      }}
    >
      <Button
        variant='outline'
        size='icon'
        className='absolute -right-11 top-0 bottom-0 my-auto'
        style={{
          display: isHidden ? 'block' : 'none',
        }}
        onClick={() => updateHideMenu(false)}
        title='Show Sidebar'
      >
        <ChevronRightIcon className='w-8 h-8 dark:text-white' />
      </Button>
      <ul
        id='account'
        className={`w-full h-fit flex-col gap-2 items-center pb-4 border-b-2 border-neutral-300 dark:dark:border-neutral-800
          ${isHidden ? 'hidden' : 'flex'}`}
      >
        {accountPages.map((page) => (
          <li
            className={`w-full overflow-x-hidden ${
              currentTab === page.name.toLocaleLowerCase()
                ? 'ml-1'
                : 'ml-0 hover:ml-1'
            }`}
            key={page.name}
          >
            <Button
              variant='ghost'
              size='icon'
              className={`w-full h-fit py-4 place-items-center items-center border-r-2 relative rounded-none
                ${
                  currentTab === page.name.toLocaleLowerCase()
                    ? 'border-r-yellow-400 text-yellow-400 cursor-default hover:text-yellow-300 hover:bg-inherit'
                    : 'border-transparent hover:bg-black/15 dark:hover:bg-white/15 dark:text-white cursor-pointer'
                }
                ${isExpanded ? 'flex pl-4' : 'grid place-items-center'}`}
              title={page.name}
              aria-label={page.name}
              onClick={() => {
                if (currentTab !== page.name) handleTabChange(page.name)
                if (isExpanded) setIsExpanded(false)
              }}
            >
              <page.icon className='w-8 h-8' />
              {isExpanded && (
                <p className='left-16 text-lg absolute'>{page.name}</p>
              )}
            </Button>
          </li>
        ))}
      </ul>
      <ul
        id='groups'
        className={`w-full h-fit flex-col gap-2 items-center pb-4 dark:text-white mt-2
          ${isHidden ? 'hidden' : 'flex'}`}
      >
        <li className='w-full'>
          <Button
            variant='ghost'
            size={'icon'}
            className={`w-full h-fit py-4 place-items-center items-center hover:bg-black/15 relative rounded-none
              ${isExpanded ? 'flex pl-4' : 'grid place-items-center'}`}
            title='Add Quick Action'
            aria-label='Add Quick Action'
          >
            <div className='w-10 h-10 border-2 border-black dark:border-white dark:text-white rounded-full grid place-items-center'>
              <PlusIcon className='w-8 h-8' />
            </div>
            {isExpanded && (
              <p className='left-16 text-sm truncate absolute'>
                Add Quick Action
              </p>
            )}
          </Button>
        </li>
      </ul>

      <Button
        variant='outline'
        size='icon'
        className={`w-fit h-fit absolute bottom-20 left-0 right-0 mx-auto p-2 ${
          isHidden ? 'hidden' : 'hidden md:grid'
        } place-items-center`}
        title={isLocked ? 'Unlock Sidebar' : 'Lock Sidebar'}
        onClick={() => setIsLocked(!isLocked)}
      >
        {isLocked ? (
          <LockClosedIcon className='w-8 h-8' />
        ) : (
          <LockOpenIcon className='w-8 h-8' />
        )}
      </Button>
      <Button
        variant='outline'
        size='icon'
        className={`w-full h-fit bottom-0 absolute grid place-items-center py-4 hover:bg-black/15 dark:hover:bg-white/15 dark:text-white
          ${isHidden ? 'hidden' : 'grid'}`}
        title='Hide Sidebar'
        aria-label='Hide Sidebar'
        onClick={() => {
          updateHideMenu(true)
        }}
      >
        <ChevronLeftIcon className='w-8 h-8' />
      </Button>
    </div>
  )
}
