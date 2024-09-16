import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  CommitteePosition,
  CommitteePositionCategory,
} from '@/models/Committee'
import { AvatarFallback } from '@radix-ui/react-avatar'
import Image from 'next/image'
import FallbackImage from 'public/images/logo.webp'
import Link from 'next/link'
import Student from '@/models/Student'

export default async function CommitteeMembersDisplay({
  language,
  members,
}: {
  language: string
  members: {
    position: CommitteePosition
    student: Student
    initiation_date: string
    termination_date: string
  }[]
}) {
  const categories: CommitteePositionCategory[] = [
    'STYRELSEN',
    'VALBEREDNINGEN',
    'STUDIENÄMNDEN',
    'NÄRINGSLIV OCH KOMMUNIKATION',
    'STUDIESOCIALT',
    'FANBORGEN',
  ]

  const memberCategories = categories.map((category) => {
    return {
      name: category,
      members: members.filter(
        (member) => member.position.category === category
      ),
    }
  })

  const hasImage = (member: any) => {
    return !!member.student.profile_picture_url
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      {categories.map((category, index) => (
        <div key={index}>
          <h2 className='text-center sm:text-start text-lg sm:text-3xl tracking-wide uppercase text-black dark:text-yellow-400'>
            {category}
          </h2>
          <div className='flex flex-wrap gap-4 mt-2 justify-center sm:justify-start'>
            {memberCategories
              .filter((member) => member.name === category)
              .map((member) =>
                member.members
                  .sort((a, b) =>
                    a.position.translations[0].title.localeCompare(
                      b.position.translations[0].title
                    )
                  )
                  .sort((a, b) => a.position.weight - b.position.weight)
                  .map((member, index) => (
                    <div
                      key={index}
                      className='w-40 sm:w-72 h-fit border rounded-md relative dark:bg-[#111] shadow-sm shadow-black/25 dark:shadow-white/25'
                    >
                      <div className='relative'>
                        <Image
                          src={
                            member.student.profile_picture_url || FallbackImage
                          }
                          alt='img'
                          width={512}
                          height={512}
                          className={`w-full aspect-square object-cover rounded-md mx-auto ${
                            !hasImage(member) &&
                            'p-8 bg-[#EEE] dark:bg-[#323232]'
                          }`}
                          quality={90}
                        />
                        <div className='w-full h-20 absolute bottom-0 from-white from-20% dark:from-[#111] bg-gradient-to-t' />
                      </div>
                      <div className='flex gap-2 items-center px-2 absolute top-4 bg-white dark:bg-[#111] border border-l-0 rounded-r-md shadow-sm shadow-black/25 dark:shadow-white/25'>
                        <Avatar className='w-6 h-6 rounded-full overflow-hidden bg-white'>
                          <AvatarImage
                            src={member.position.committee?.logo_url}
                            alt={`${member.position.translations[0].title} logo`}
                            width={32}
                            height={32}
                            className='w-6 h-full object-contain p-0.5'
                          />
                          <AvatarFallback>
                            <Image
                              src={FallbackImage.src}
                              alt='Fallback image'
                              width={24}
                              height={24}
                              className='w-6 bg-white rounded-full p-0.5'
                            />
                          </AvatarFallback>
                        </Avatar>
                        <p
                          className={`${
                            member.position.translations[0].title.length > 15 &&
                            !/\s/.test(member.position.translations[0].title)
                              ? 'text-xs'
                              : 'text-xs md:text-sm'
                          } truncate lg:text-wrap lg:overflow-visible lg:whitespace-normal uppercase tracking-wider w-fit max-w-56 leading-4 py-0.5`}
                          title={member.position.translations[0].title}
                        >
                          {member.position.translations[0].title}
                        </p>
                      </div>
                      <div className='px-2 pb-2 h-24'>
                        <p className='text-xl max-h-14 overflow-hidden'>
                          {member.student.first_name +
                            ' ' +
                            (member.student.last_name || '')}
                        </p>
                        <Link
                          href={`mailto:${member.position.email}`}
                          target='_blank'
                          className='text-xs break-words sm:text-sm text-neutral-700 hover:text-yellow-400 hover:underline underline-offset-4 dark:text-neutral-300 dark:hover:text-yellow-400'
                          title={`Mail to ${member.position.email}`}
                        >
                          {member.position.email}
                        </Link>
                      </div>
                    </div>
                  ))
              )}
          </div>
          <Separator className='w-full sm:w-1/3 mt-4 bg-yellow-400' />
        </div>
      ))}
    </div>
  )
}
