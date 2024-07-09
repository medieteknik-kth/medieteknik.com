'use client'

import NLGIcon from 'public/images/committees/nlg.png'
import KOMNIcon from 'public/images/committees/komn.png'
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import InternationalsIcon from 'public/images/committees/internationals.png'
import {
  UserIcon,
  DocumentDuplicateIcon,
  LifebuoyIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusIcon,
  UserGroupIcon,
  LockOpenIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import React, {
  Dispatch,
  ForwardRefExoticComponent,
  LazyExoticComponent,
  SetStateAction,
  SVGProps,
  useEffect,
  useState,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'
import Loading from '@/components/tooltips/Loading'
const AccountPage = React.lazy(() => import('./pages/accountPage'))
const PreferencesPage = React.lazy(() => import('./pages/preferencesPage'))
const CommitteesPage = React.lazy(() => import('./pages/committeesPage'))
const ItemsPage = React.lazy(() => import('./pages/itemPage'))

type Tabs = 'account' | 'preferences' | 'committees' | 'items'

interface AccountPage {
  name: Tabs
  icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  page: LazyExoticComponent<
    ({ language }: { language: string }) => React.JSX.Element
  >
}

const accountPages: AccountPage[] = [
  {
    name: 'account',
    icon: UserIcon,
    page: AccountPage,
  },
  {
    name: 'preferences',
    icon: LifebuoyIcon,
    page: PreferencesPage,
  },
  {
    name: 'committees',
    icon: UserGroupIcon,
    page: CommitteesPage,
  },
  {
    name: 'items',
    icon: DocumentDuplicateIcon,
    page: ItemsPage,
  },
]

function Sidebar({
  currentTab,
  setCurrentTab,
}: {
  currentTab: Tabs | null
  setCurrentTab: Dispatch<SetStateAction<Tabs | null>>
}) {
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
      onMouseOver={() => updateExpandMenu(true)}
      onClick={(e) => {
        e.stopPropagation()
        if (smallScreen) {
          if (isExpanded) {
            setIsExpanded(false)
            setIsHidden(true)
          } else {
            updateExpandMenu(!isExpanded)
          }
        }
      }}
      onMouseLeave={() => updateExpandMenu(false)}
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
        className='w-full h-fit flex-col items-center pb-4 border-b-2 border-neutral-300 dark:dark:border-neutral-800'
        style={{
          display: isHidden ? 'none' : 'flex',
        }}
      >
        {accountPages.map((page) => (
          <li
            className={`w-full my-2 overflow-x-hidden ${
              currentTab === page.name.toLocaleLowerCase()
                ? 'ml-1'
                : 'ml-0 hover:ml-1'
            }`}
            key={page.name}
          >
            <button
              className={`w-full py-4 place-items-center items-center border-r-2 relative capitalize ${
                currentTab === page.name.toLocaleLowerCase()
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-transparent hover:bg-black/15 dark:hover:bg-white/15 dark:text-white'
              }`}
              title={page.name}
              aria-label={page.name}
              style={{
                display: isExpanded ? 'flex' : 'grid',
                placeItems: isExpanded ? '' : 'center',
                paddingLeft: isExpanded ? '1rem' : '0',
                cursor:
                  currentTab === page.name.toLocaleLowerCase()
                    ? 'default'
                    : 'pointer',
              }}
              onClick={() => {
                if (currentTab !== page.name) handleTabChange(page.name)
                if (isExpanded) setIsExpanded(false)
              }}
            >
              <page.icon className='w-8 h-8' />
              {isExpanded && (
                <p className='left-16 text-lg absolute'>{page.name}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
      <ul
        id='groups'
        className='w-full h-fit flex flex-col items-center pb-4 dark:text-white'
        style={{
          display: isHidden ? 'none' : 'flex',
        }}
      >
        <li className='w-full my-2'>
          <button
            className='w-full py-4 place-items-center items-center hover:bg-black/15 relative'
            style={{
              display: isExpanded ? 'flex' : 'grid',
              placeItems: isExpanded ? '' : 'center',
              paddingLeft: isExpanded ? '1rem' : '0',
            }}
          >
            <div className='w-10 h-10 border-2 rounded-full grid place-items-center border-black dark:border-white'>
              <Image
                src={NLGIcon.src}
                alt='NLG'
                width={64}
                height={64}
                className='w-6 h-6'
              />
            </div>
            {isExpanded && (
              <p className='left-16 text-sm truncate absolute'>NLG</p>
            )}
          </button>
        </li>
        <li className='w-full my-2'>
          <button
            className='w-full py-4 place-items-center items-center hover:bg-black/15 relative'
            style={{
              display: isExpanded ? 'flex' : 'grid',
              placeItems: isExpanded ? '' : 'center',
              paddingLeft: isExpanded ? '1rem' : '0',
            }}
          >
            <div className='w-10 h-10 border-2 border-black dark:border-white  rounded-full grid place-items-center'>
              <Image
                src={KOMNIcon.src}
                alt='KOMN'
                width={64}
                height={64}
                className='w-6 h-6'
              />
            </div>
            {isExpanded && (
              <p className='left-16 text-sm truncate absolute'>KOMN</p>
            )}
          </button>
        </li>
        <li className='w-full my-2'>
          <Link
            href='/chapter/committees/styrelsen/manage'
            className='w-full py-4 place-items-center items-center hover:bg-black/15 relative'
            style={{
              display: isExpanded ? 'flex' : 'grid',
              placeItems: isExpanded ? '' : 'center',
              paddingLeft: isExpanded ? '1rem' : '0',
            }}
          >
            <div className='w-10 h-10 border-2 border-black dark:border-white  rounded-full grid place-items-center'>
              <Image
                src={StyrelsenIcon.src}
                alt='KOMN'
                width={64}
                height={64}
                className='w-6 h-6'
              />
            </div>
            {isExpanded && (
              <p className='left-16 text-sm truncate absolute'>Styrelsen</p>
            )}
          </Link>
        </li>
        <li className='w-full my-2'>
          <button
            className='w-full py-4 place-items-center items-center hover:bg-black/15 relative'
            style={{
              display: isExpanded ? 'flex' : 'grid',
              placeItems: isExpanded ? '' : 'center',
              paddingLeft: isExpanded ? '1rem' : '0',
            }}
          >
            <div className='w-10 h-10 border-2 border-black dark:border-white  rounded-full grid place-items-center'>
              <Image
                src={InternationalsIcon.src}
                alt='Internationals'
                width={64}
                height={64}
                className='w-6 h-6'
              />
            </div>
            {isExpanded && (
              <p className='left-16 text-sm truncate absolute'>
                Internationella
              </p>
            )}
          </button>
        </li>
        <li className='w-full my-2'>
          <button
            className='w-full py-4 place-items-center items-center hover:bg-black/15 relative'
            style={{
              display: isExpanded ? 'flex' : 'grid',
              placeItems: isExpanded ? '' : 'center',
              paddingLeft: isExpanded ? '1rem' : '0',
            }}
            title='Add Group'
            aria-label='Add Group'
          >
            <div className='w-10 h-10 border-2 border-black dark:border-white dark:text-white rounded-full grid place-items-center'>
              <PlusIcon className='w-8 h-8' />
            </div>
            {isExpanded && (
              <p className='left-16 text-sm truncate absolute'>Add Committee</p>
            )}
          </button>
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
        className='w-full h-fit bottom-0 absolute grid place-items-center py-4 hover:bg-black/15 dark:hover:bg-white/15 dark:text-white'
        style={{
          display: isHidden ? 'none' : 'grid',
        }}
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

export default function Base({
  params: { language },
}: {
  params: { language: string }
}) {
  const [currentTab, setCurrentTab] = useState<Tabs | null>(null)

  const searchParams = useSearchParams()
  useEffect(() => {
    const tab = searchParams.get('category') || 'account'
    setCurrentTab(tab as Tabs)
  }, [searchParams])

  return (
    <div className='w-full h-full relative'>
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className='w-full min-h-[1080px] h-fit flex'>
        <div className='w-0 md:w-24 h-full' />
        <React.Suspense fallback={<Loading language={language} />}>
          {accountPages.map((page) =>
            currentTab === page.name.toLocaleLowerCase() ? (
              <page.page key={page.name} language={language} />
            ) : (
              <div key={page.name} />
            )
          )}
        </React.Suspense>
      </div>
    </div>
  )
}
