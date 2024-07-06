'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
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
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function MembersPage({
  data,
}: {
  data: {
    members: {
      ids: string[]
      total: number
    }
    positions: {
      ids: string[]
      total: number
    }
  } | null
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])

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
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{data?.members.total}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant={'outline'}
                className='mr-4'
                disabled={!data}
                title='Add a new member to the committee'
              >
                <PlusIcon className='w-5 h-5 mr-2' />
                Add
              </Button>
              <Button
                variant={'destructive'}
                disabled={data?.members.total === 0 || !data}
                title='Remove a member from the committee'
              >
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
              {isLoading ? (
                <Skeleton className='w-32 h-8' />
              ) : (
                <p className='text-2xl'>{data?.positions.total}</p>
              )}
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger>
                  <Button
                    variant={'outline'}
                    className='mr-4'
                    disabled={!data}
                    title='Create a new position to the committee'
                  >
                    <PlusIcon className='w-5 h-5 mr-2' />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new position</DialogTitle>
                    <DialogDescription>
                      Add a new position to the committee
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Label htmlFor='positionName'>Name</Label>
                    <Input
                      id='positionName'
                      autoComplete='off'
                      placeholder='Position Name'
                    />
                  </div>
                  <div>
                    <Label htmlFor='positionEmail'>Email (optional)</Label>
                    <Input
                      id='positionEmail'
                      type='email'
                      autoComplete='off'
                      placeholder='Position Email'
                    />
                  </div>
                  <div className='relative'>
                    <Label htmlFor='positionDescription'>Description</Label>
                    <Textarea
                      id='positionDescription'
                      placeholder='Position Description'
                      className='max-h-32'
                    />
                    <p className='absolute bottom-2 right-2 text-xs select-none text-neutral-600'>
                      0/500
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant={'outline'}
                className='mr-4'
                disabled={!data || data?.positions.total === 0}
                title='Open a position for recruitment'
              >
                <ClockIcon className='w-5 h-5 mr-2' />
                Recruit
              </Button>
              <Button
                variant={'destructive'}
                disabled={data?.positions.total === 0 || !data}
                title='Remove a position from the committee'
              >
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
