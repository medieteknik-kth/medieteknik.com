import Committee, { CommitteePosition } from '@/models/Committee'
import { News, Author } from '@/models/Items'
import Student, { StudentType } from '@/models/Student'
import { API_BASE_URL } from '@/utility/Constants'
import Body from './body'
import { StudentTag } from '@/components/tags/StudentTag'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import MedieteknikSVG from 'public/images/svg/medieteknik.svg'
import THSSVG from 'public/images/svg/ths.svg'
import DatateknikSVG from 'public/images/svg/datateknik.svg'
import KTHSVG from 'public/images/svg/kth.svg'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

async function getData(language_code: string, slug: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/public/news/${slug}?language=${language_code}`
    )

    if (response.ok) {
      const data = await response.json()
      return data as News
    }
  } catch (error) {
    console.error(error)
  }
}

function assignCorrectAuthor(author: Author): Author | null {
  if (author.author_type === 'STUDENT') {
    return author as Student
  } else if (author.author_type === 'COMMITTEE') {
    return author as Committee
  } else if (author.author_type === 'COMMITTEE_POSITION') {
    return author as CommitteePosition
  }

  return null
}

export default async function NewsPage({
  params: { language, slug },
}: {
  params: { language: string; slug: string }
}) {
  const data = await getData(language, slug)

  if (!data) {
    return <div>Not found</div>
  }

  let correctedAuthor = assignCorrectAuthor(data.author)
  if (!correctedAuthor) {
    return <div>Not found author</div>
  }
  let student_type: StudentType | false =
    correctedAuthor.author_type === 'STUDENT' &&
    (correctedAuthor as Student).student_type

  return (
    <main>
      <div className='h-24 bg-black' />
      <Breadcrumb className='w-full h-fit border-b px-4 py-2'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={'/' + language + '/bulletin'}
              className='py-2'
            >
              Bulletin
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={'/' + language + '/bulletin/news'}
              className='py-2'
            >
              News
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className='capitalize py-2 italic'>
              {data.translations[0].title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='flex flex-col items-center justify-start min-h-[1080px] h-fit px-4 sm:px-20 lg:px-0'>
        <div className='w-full lg:w-[700px] h-fit border-b-2 border-yellow-400 pb-1 mb-1'>
          <ul className='flex min-h-10 h-fit py-2'>
            {data.categories &&
              data.categories.map((category) => (
                <li className='px-2 py-1 border rounded-2xl' key={category}>
                  {category}
                </li>
              ))}
          </ul>
          <h1 className='text-4xl'>{data.translations[0].title}</h1>
          <h2 className='text-lg my-2'>
            {correctedAuthor && correctedAuthor.author_type === 'STUDENT' ? (
              <div className='flex items-center'>
                <StudentTag
                  student={correctedAuthor as Student}
                  includeAt={false}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {student_type === 'MEDIETEKNIK' ? (
                        <MedieteknikSVG
                          width={28}
                          height={28}
                          className='border rounded-full p-0.5 ml-1'
                        />
                      ) : student_type === 'THS' ? (
                        <THSSVG
                          width={28}
                          height={28}
                          className='border rounded p-0.5 ml-1'
                        />
                      ) : student_type === 'DATATEKNIK' ? (
                        <DatateknikSVG
                          width={28}
                          height={28}
                          className='border rounded p-0.5 ml-1'
                        />
                      ) : student_type === 'KTH' ? (
                        <KTHSVG
                          width={28}
                          height={28}
                          className='border rounded p-0.5 ml-1'
                        />
                      ) : (
                        <GlobeAltIcon className='w-7 h-7 border rounded p-0.5 ml-1' />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {student_type === 'OTHER'
                          ? 'Person is independent'
                          : student_type === 'THS'
                          ? 'Student is a part of THS'
                          : 'Student is studying at ' + student_type}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : correctedAuthor.author_type === 'COMMITTEE' ? (
              <CommitteeTag
                committee={correctedAuthor as Committee}
                includeAt={false}
                includeBackground={false}
              />
            ) : (
              correctedAuthor.author_type === 'COMMITTEE_POSITION' && (
                <CommitteePositionTag
                  committeePosition={correctedAuthor as CommitteePosition}
                />
              )
            )}
          </h2>
          <p className='text-sm mt-4'>
            <span className='font-bold'>Published: </span>
            {new Date(data.created_at).toDateString()}
          </p>
          {data.last_updated && (
            <p className='text-sm mt-2'>
              <span className='font-bold'>Last updated: </span>
              {new Date(data.last_updated).toDateString()}
            </p>
          )}
        </div>
        <div className='w-full lg:w-[700px] my-4 mb-8'>
          <Body body={data.translations[0].body} />
        </div>
      </div>
    </main>
  )
}
