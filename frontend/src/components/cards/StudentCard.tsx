import StudentTag from '@/components/tags/StudentTag'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StudentCommitteePosition } from '@/models/Student'
import Image from 'next/image'
import Link from 'next/link'
import FallbackImage from 'public/images/logo.webp'

interface StudentCommitteeCardProps {
  member: StudentCommitteePosition
  committeeLogo?: boolean
}

export default function StudentCommitteCard({
  member,
  committeeLogo = true,
}: StudentCommitteeCardProps) {
  const hasImage = (member: StudentCommitteePosition) => {
    return !!member.student.profile_picture_url
  }

  return (
    <div className='w-72 border rounded-md relative dark:bg-[#111] shadow-sm shadow-black/25 dark:shadow-white/25'>
      <div className='relative'>
        <Image
          src={member.student.profile_picture_url || FallbackImage}
          alt='img'
          width={512}
          height={512}
          className={`w-full aspect-square object-cover rounded-md mx-auto ${
            !hasImage(member) && 'p-8 bg-[#EEE] dark:bg-[#323232]'
          }`}
          quality={90}
        />
        <div className='w-full h-20 absolute bottom-0 from-white from-20% dark:from-[#111] bg-gradient-to-t' />
      </div>
      <div className='flex gap-2 items-center px-2 absolute top-4 bg-white dark:bg-[#111] border border-l-0 rounded-r-md shadow-sm shadow-black/25 dark:shadow-white/25'>
        <Avatar
          className={`${
            committeeLogo
              ? 'w-6 h-6 rounded-full overflow-hidden bg-white'
              : 'hidden'
          }`}
        >
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
          } truncate lg:text-wrap lg:overflow-visible lg:whitespace-normal uppercase tracking-wider w-fit max-w-36 sm:max-w-56 leading-4 py-0.5`}
          title={member.position.translations[0].title}
        >
          {member.position.translations[0].title}
        </p>
      </div>
      <div className='px-2 pb-2 h-fit flex flex-col gap-2 text-xl'>
        <StudentTag
          student={member.student}
          includeAt={false}
          includeImage={false}
        />
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
  )
}
