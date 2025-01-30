import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import StudentTag from '@/components/tags/StudentTag'
import type { StudentCommitteePosition } from '@/models/Student'
import Image from 'next/image'
import FallbackImage from 'public/images/logo.webp'

interface StudentCommitteeCardProps {
  member: StudentCommitteePosition
  committeeLogo?: boolean
}

export default function StudentCommitteCard({
  member,
  committeeLogo = false,
}: StudentCommitteeCardProps) {
  return (
    <div className='w-72 border rounded-md overflow-hidden relative shadow-sm'>
      <div className='relative'>
        {member.student.profile_picture_url ? (
          <Image
            src={member.student.profile_picture_url}
            alt='img'
            width={512}
            height={512}
            className='w-full aspect-square object-cover rounded-t-md mx-auto'
            quality={90}
          />
        ) : committeeLogo && member.position.committee ? (
          <div className='w-full h-auto aspect-square grid place-items-center bg-white'>
            <Image
              src={member.position.committee.logo_url}
              alt={`${member.position.committee.translations[0].title} logo`}
              unoptimized={true} // Logos are SVGs, so they don't need to be optimized
              width={286}
              height={286}
              className='w-1/2 object-cover'
              quality={90}
            />
          </div>
        ) : (
          <div className='w-full h-auto aspect-square grid place-items-center bg-white'>
            <Image
              src={FallbackImage.src}
              alt='img'
              width={286}
              height={286}
              className='w-1/2 object-cover'
              quality={90}
            />
          </div>
        )}

        <div className='w-full h-20 absolute bottom-0 from-white from-10% dark:from-[#111] bg-gradient-to-t to-70%' />
      </div>
      {committeeLogo && member.position.committee && (
        <div className='w-8 h-8 rounded-md overflow-hidden bg-white absolute right-4 top-4 shadow border border-[#e7e5e4]'>
          <Image
            src={member.position.committee.logo_url}
            alt={`${member.position.translations[0].title} logo`}
            unoptimized={true} // Logos are SVGs, so they don't need to be optimized
            width={32}
            height={32}
            className='w-full h-full object-contain p-0.5'
          />
        </div>
      )}

      <div className='px-2 pb-2 h-fit flex flex-col text-lg sm:text-xl dark:bg-[#111]'>
        <CommitteePositionTag committeePosition={member.position} />
        <StudentTag
          student={member.student}
          includeAt={false}
          includeImage={false}
        />
      </div>
    </div>
  )
}
