import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Committee from '@/models/Committee'
import Link from 'next/link'

interface Props {
  language: string
  committees: Committee[]
}

function filteredCommittees(committees: Committee[]) {
  return committees.filter((committee) => committee.total_media > 0)
}

export default function MediaGridView({ language, committees }: Props) {
  const filtered = filteredCommittees(committees)
  return (
    <section className={`${filtered.length === 0 ? 'hidden' : 'px-10 py-2'}`}>
      <h2 className='text-2xl font-bold capitalize'>Committees</h2>
      <ul className='flex flex-wrap gap-4 py-2'>
        {filtered
          .sort((a, b) => b.total_media - a.total_media)
          .map((committee, index) => (
            <li
              key={index}
              className='w-72 h-fit rounded-md border overflow-hidden relative transition-transform hover:scale-105'
            >
              <Link
                href={`./media/${encodeURIComponent(
                  committee.translations[0].title.toLowerCase()
                )}`}
                className='w-full py-2 px-1 flex items-center gap-2'
              >
                <Avatar className='bg-white rounded-full overflow-hidden'>
                  <AvatarImage
                    className='h-10 w-auto aspect-square object-fill p-1.5'
                    width={128}
                    height={128}
                    src={committee.logo_url ?? ''}
                    alt={committee.translations[0].title}
                  />
                  <AvatarFallback>
                    {committee.translations[0].title + ' Profile Picture'}
                  </AvatarFallback>
                </Avatar>

                <div className='flex flex-col text-start overflow-hidden'>
                  <p className='truncate'>{committee.translations[0].title}</p>
                  <span className='text-xs text-neutral-600'>
                    {committee.total_media} Media
                  </span>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  )
}
