import { Button } from '@/components/ui/button'
import type Student from '@/models/Student'
import type { Profile } from '@/models/Student'
import Image from 'next/image'
import Link from 'next/link'
import FacebookSVG from 'public/images/svg/facebook.svg'
import InstagramSVG from 'public/images/svg/instagram.svg'
import LinkedInSVG from 'public/images/svg/linkedin.svg'
import type { JSX } from 'react'

interface Props {
  student: Student
  profile?: Profile
}

/**
 * @name StudentInfo
 * @description Displays the student's basic information such as name and profile picture, and social media links if available
 *
 * @param {Props} props - The props
 * @param {Student} props.student - The student
 * @param {Profile} props.profile - The student's profile information
 * @returns {Promise<JSX.Element>} The student's information
 */
export default async function StudentInfo({
  student,
  profile,
}: Props): Promise<JSX.Element> {
  return (
    <section className='mt-48 md:mt-36 lg:mt-[184px] relative'>
      <div className='w-fit h-fit flex flex-col xs:flex-row items-center mx-2 sm:mx-5 md:mx-12 text-black dark:text-yellow-400'>
        <div className='w-32 md:w-52 h-auto aspect-square bg-yellow-400 border-4 border-yellow-400 rounded-full overflow-hidden self-start grid place-items-center'>
          {student.profile_picture_url ? (
            <Image
              src={student.profile_picture_url}
              alt='Profile Picture'
              width={256}
              height={256}
            />
          ) : (
            <div className='bg-yellow-400 text-6xl font-bold select-none'>
              {student.first_name.charAt(0) +
                (student.last_name ? student.last_name.charAt(0) : '')}
            </div>
          )}
        </div>
        <div className='w-fit relative h-full flex flex-wrap items-center ml-4 gap-4 mt-2 xs:mt-20 md:mt-32'>
          <h1 className='grow text-2xl md:text-5xl dark:text-white font-semibold text-pretty max-h-24'>
            {`${student.first_name} ${student.last_name || ''}`}
          </h1>
        </div>
      </div>
      {profile && (
        <div className='w-fit h-fit absolute left-32 xs:left-auto xs:right-4 lg:right-auto lg:left-64 ml-4 -bottom-4 xs:bottom-40 lg:bottom-14 top-0 my-auto flex flex-wrap xs:flex-col xs:items-end lg:items-start lg:flex-row gap-2 xs:gap-0.5 lg:gap-2'>
          {profile.instagram_url && (
            <>
              <Button
                className='flex gap-2 xs:hidden'
                variant={'outline'}
                size={'icon'}
                asChild
              >
                <Link
                  href={profile.instagram_url}
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <InstagramSVG
                    className='w-6 h-6'
                    style={{ fill: '#E1306C' }}
                  />
                </Link>
              </Button>
              <Button
                className='gap-2 hidden xs:flex'
                variant={'outline'}
                asChild
              >
                <Link
                  href={profile.instagram_url}
                  target='_blank'
                  rel='noreferrer noopener'
                  className='w-fit'
                >
                  <InstagramSVG
                    className='w-6 h-6'
                    style={{ fill: '#E1306C' }}
                  />
                  <p>
                    {decodeURIComponent(profile.instagram_url).split('/')[3]}
                  </p>
                </Link>
              </Button>
            </>
          )}
          {profile.facebook_url && (
            <>
              <Button
                className='flex gap-2 xs:hidden'
                variant={'outline'}
                size={'icon'}
                asChild
              >
                <Link
                  href={profile.facebook_url}
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <FacebookSVG
                    className='w-6 h-6'
                    style={{ fill: '#1877F2' }}
                  />
                </Link>
              </Button>
              <Button
                className='hidden gap-2 xs:flex'
                variant={'outline'}
                asChild
              >
                <Link
                  href={profile.facebook_url}
                  target='_blank'
                  rel='noreferrer noopener'
                  className='w-fit'
                >
                  <FacebookSVG
                    className='w-6 h-6'
                    style={{ fill: '#1877F2' }}
                  />
                  <p>
                    {decodeURIComponent(profile.facebook_url).split('/')[3]}
                  </p>
                </Link>
              </Button>
            </>
          )}
          {profile.linkedin_url && (
            <>
              <Button
                className='flex gap-2 xs:hidden'
                variant={'outline'}
                size={'icon'}
                asChild
              >
                <Link
                  href={profile.linkedin_url}
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <LinkedInSVG
                    className='w-6 h-6'
                    style={{ fill: '#0A66C2' }}
                  />
                </Link>
              </Button>
              <Button
                className='gap-2 hidden xs:flex'
                variant={'outline'}
                asChild
              >
                <Link
                  href={profile.linkedin_url}
                  target='_blank'
                  rel='noreferrer noopener'
                  className='w-fit'
                >
                  <LinkedInSVG
                    className='w-6 h-6'
                    style={{ fill: '#0A66C2' }}
                  />
                  <p>
                    {decodeURIComponent(profile.linkedin_url)
                      .split('/in/')[1]
                      .replace('/', '')}
                  </p>
                </Link>
              </Button>
            </>
          )}
        </div>
      )}
    </section>
  )
}
