import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Logo from 'public/images/logo.png'
import {
  BuildingOffice2Icon,
  ClockIcon,
  Cog6ToothIcon,
  IdentificationIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export default function MembersPage() {
  return (
    <section className='grow'>
      <h2 className='text-2xl py-3 border-b-2 border-yellow-400'>
        Members & Positions
      </h2>
      <div className='flex flex-col mt-4'>
        <div className='flex mb-4'>
          <Card className='w-fit relative mr-4'>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                <UsersIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Active Students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl'>20</p>
            </CardContent>
            <CardFooter>
              <Button variant={'outline'} className='mr-4'>
                <PlusIcon className='w-5 h-5 mr-2' />
                Add
              </Button>
              <Button variant={'destructive'}>
                <TrashIcon className='w-5 h-5 mr-2' />
                Remove
              </Button>
            </CardFooter>
          </Card>

          <Card className='w-fit relative mr-4'>
            <CardHeader>
              <CardTitle>Positions</CardTitle>
              <CardDescription>
                <IdentificationIcon className='absolute top-6 right-4 w-5 h-5 mr-2' />
                Total Positions in the committee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-2xl'>8</p>
            </CardContent>
            <CardFooter>
              <Button variant={'outline'} className='mr-4'>
                <PlusIcon className='w-5 h-5 mr-2' />
                Add
              </Button>
              <Button variant={'outline'} className='mr-4'>
                <ClockIcon className='w-5 h-5 mr-2' />
                Recruit
              </Button>
              <Button variant={'destructive'}>
                <TrashIcon className='w-5 h-5 mr-2' />
                Remove
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Card className='relative'>
          <CardHeader>
            <CardTitle>Active Members</CardTitle>
            <CardDescription>
              <BuildingOffice2Icon className='absolute top-6 right-4 w-5 h-5 mr-2' />
              Current members in the committee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Initiated</TableHead>
                  <TableHead>Expected Termination</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className='flex items-center space-x-3'>
                      <Avatar>
                        <AvatarImage
                          src={Logo.src}
                          alt='Avatar'
                          width={32}
                          height={32}
                        />
                        <AvatarFallback>
                          <span className='sr-only'>Avatar</span>
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='font-bold'>André Eriksson</h3>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Webmaster</TableCell>
                  <TableCell>
                    {new Date('January 20 2023').toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date('January 20 2024').toLocaleDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className='flex items-center space-x-3'>
                      <Avatar>
                        <AvatarImage
                          src={Logo.src}
                          alt='Avatar'
                          width={32}
                          height={32}
                        />
                        <AvatarFallback>
                          <span className='sr-only'>Avatar</span>
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='font-bold'>Viggo Halvarsson Skoog</h3>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Webmaster</TableCell>
                  <TableCell>
                    {new Date('January 20 2023').toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date('January 20 2024').toLocaleDateString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
