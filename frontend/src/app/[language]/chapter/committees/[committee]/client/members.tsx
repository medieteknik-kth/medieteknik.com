import Image from 'next/image'
import FallbackImage from 'public/images/logo.webp'
import { GetCommitteeMembers } from '@/api/committee'
import Link from 'next/link'

export const revalidate = 60 * 60 * 24 * 30

export default async function CommitteeMembers({
  language,
  committee,
}: {
  language: string
  committee: string
}) {
  const members = await GetCommitteeMembers(committee, language)
  const committeeName = decodeURIComponent(committee)

  if (!members || members.length === 0) {
    return (
      <section>
        <div className='pt-12 mb-10 grid place-items-center'>
          <h2 className='text-3xl capitalize'>
            No members in <span className='font-bold'>{committeeName}</span>
          </h2>
        </div>
      </section>
    )
  }

  const hasImage = (member: any) => {
    return !!member.student.profile_picture_url
  }

  return (
    <section className='h-fit relative'>
      <div className='pt-12 mb-10 grid place-items-center'>
        <h2 className='text-3xl capitalize'>
          Meet <span className='font-bold'>{committeeName}</span>
        </h2>
      </div>
      <div className='w-full h-full flex flex-wrap gap-8 justify-center grid-flow-row px-12 mb-6'>
        {members.map((member, index) => (
          <div
            key={index}
            className='w-72 h-fit border rounded-md relative dark:bg-[#111] shadow-sm shadow-black/25 dark:shadow-white/25'
          >
            <div className='relative'>
              <Image
                src={member.student.profile_picture_url || FallbackImage}
                alt='img'
                width={286}
                height={286}
                className={`w-full aspect-square object-cover rounded-md mx-auto ${
                  !hasImage(member) && 'p-8 bg-[#EEE] dark:bg-[#323232]'
                }`}
              />
              <div className='w-full h-20 absolute bottom-0 from-white from-20% dark:from-[#111] bg-gradient-to-t' />
            </div>
            <div className='px-2 absolute top-4 bg-white dark:bg-[#111] border border-l-0 rounded-r-md shadow-sm shadow-black/25 dark:shadow-white/25'>
              <p className='text-sm uppercase tracking-wider max-w-40 leading-4 py-0.5'>
                {member.position.translations[0].title}
              </p>
            </div>
            <div className='px-2 pb-2 h-24'>
              <p className='text-xl max-h-14 overflow-hidden '>
                {member.student.first_name + ' ' + member.student.last_name}
              </p>
              <Link
                href={`mailto:${member.position.email}`}
                className='text-sm text-neutral-700 hover:text-yellow-400 hover:underline underline-offset-4 dark:text-neutral-300 dark:hover:text-yellow-400'
                title={`Mail to ${member.position.email}`}
              >
                {member.position.email}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
