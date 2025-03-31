import { ProfileButton } from '@/components/header/components/ProfileButton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ProfileButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className='w-48 flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <p className='text-sm'>Settings</p>
          </div>
          <div className='flex items-center gap-2'>
            <p className='text-sm'>Logout</p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
