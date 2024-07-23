'use client'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { HeaderElement } from '../Header'
import Student from '@/models/Student'
import { TFunction } from 'next-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  PowerIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import Logo from 'public/images/logo.webp'
import StyrelsenIcon from 'public/images/committees/styrelsen.png'

interface Props {
  language: string
  t: TFunction
  student: Student
  logout: () => void
}

export default function UserLoggedIn({ language, t, student, logout }: Props) {
  const { committees, role } = useAuthentication()
  const profileElements: HeaderElement[] = t('profileNavs', {
    returnObjects: true,
  })

  let username = student.first_name + ' ' + student.last_name
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className='w-full h-full flex justify-center xl:justify-end items-center mr-2 rounded-none'
          variant={'ghost'}
        >
          <p className='text-sm hidden flex-col items-end mr-4 uppercase xl:flex'>
            {username}
          </p>
          <div className='xl:mr-4 border border-white rounded-full bg-white'>
            <Avatar>
              <AvatarImage
                src={student.profile_picture_url || Logo.src}
                width={40}
                height={40}
                alt='Profile Picture'
                loading='lazy'
              />
              <AvatarFallback>Profile Picture</AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-72 sm:w-96 h-fit mr-2'>
        <div className='flex items-center px-2'>
          <Avatar>
            <AvatarImage
              src={student.profile_picture_url || Logo.src}
              width={40}
              height={40}
              alt='Profile Picture'
              loading='lazy'
            />
            <AvatarFallback>Profile Picture</AvatarFallback>
          </Avatar>
          <DropdownMenuLabel className='w-full text-lg flex flex-col ml-2 max-w-[300px] '>
            <p className='truncate'>{username}</p>
            <span className='font-normal text-sm text-neutral-500'>
              {student.email}
            </span>
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={`/${language}/profile`}
              className='w-full flex items-center pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer mb-1'
              title='Your profile'
            >
              <UserIcon className='w-4 h-4 mr-2' />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/${language}/account`}
              className='w-full flex items-center pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer'
              title='Account settings'
            >
              <Cog6ToothIcon className='w-4 h-4 mr-2' />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {committees.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <UserGroupIcon className='w-4 h-4 mr-2' />
                  <span>Committees</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className='w-fit'>
                    <DropdownMenuItem>
                      <Link
                        href={`/${language}/committee`}
                        className='w-full flex !justify-start'
                      >
                        <Avatar className='w-4 h-4 mr-1'>
                          <AvatarImage
                            src={StyrelsenIcon.src}
                            alt='Profile Picture'
                          />
                          <AvatarFallback>Committee Picture</AvatarFallback>
                        </Avatar>
                        <span>Styrlesen</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href={`/${language}/committee`}
                        className='w-full flex items-center !justify-start'
                      >
                        <Avatar className='w-4 h-4 mr-1'>
                          <AvatarImage
                            src={StyrelsenIcon.src}
                            alt='Profile Picture'
                          />
                          <AvatarFallback>Committee Picture</AvatarFallback>
                        </Avatar>
                        <span>Näringslivsgruppen</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </>
        )}
        {role.includes('ADMIN') && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={`/${language}/admin`}
                  className='w-full flex items-center pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer'
                  title='Admin Dashboard'
                >
                  <PowerIcon className='w-4 h-4 mr-2' />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={`/${language}/support`}
              className='w-full flex items-center pr-2 border-l-2 border-transparent hover:border-yellow-400 rounded-l-none py-2 cursor-pointer'
              title='Support'
            >
              <LifebuoyIcon className='w-4 h-4 mr-2' />
              <span>Support</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={'destructive'} onClick={logout} className='w-full'>
              <ArrowRightStartOnRectangleIcon className='w-4 h-4 mr-2' />
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
