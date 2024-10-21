import { GetLatestMedia } from '@/api/items'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import { StudentTag } from '@/components/tags/StudentTag'
import { PhotoIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  language: string
}

export default async function RecentMedia({ language }: Props) {
  const latest = await GetLatestMedia(language)

  const empty = !latest || Object.keys(latest).length === 0

  return (
    <section className='px-10 py-2'>
      <h2 className='text-2xl font-bold capitalize'>Recent Uploads</h2>
      {empty ? (
        <p>No media found</p>
      ) : (
        <section className='flex flex-col justify-center gap-2 my-0.5'>
          <div className='flex items-center gap-2 my-0.5'>
            <PhotoIcon className='w-6 h-6' />
            <h3 className='text-lg font-semibold'>Images</h3>
          </div>
          <ul className='w-fit flex gap-4 pb-4'>
            {latest
              .filter((item) => item.media_type === 'image')
              .map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.media_url}
                    target='_blank'
                    className='w-72 aspect-square relative rounded-md transition-transform hover:scale-105 block overflow-hidden'
                  >
                    <div className='absolute bg-black/75 bottom-0 left-0 w-full h-fit flex items-center py-2 px-1 text-white'>
                      {item.author.author_type === 'STUDENT' ? (
                        <StudentTag student={item.author} />
                      ) : item.author.author_type === 'COMMITTEE' ? (
                        <CommitteeTag
                          committee={item.author}
                          includeAt={false}
                          includeBackground={false}
                        >
                          <span className='text-sm'>
                            {new Date(item.created_at).toLocaleDateString(
                              language,
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </CommitteeTag>
                      ) : (
                        <p>?</p>
                      )}
                    </div>
                    <Image
                      src={item.media_url}
                      alt={item.translations[0].title}
                      width={288}
                      height={288}
                      className='w-full h-full object-cover'
                    />
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}
    </section>
  )
}
