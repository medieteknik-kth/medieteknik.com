import Body from '@/app/[language]/bulletin/news/[slug]/client/body'
import { assignCorrectAuthor } from '@/app/[language]/bulletin/news/[slug]/util'
import CommitteePositionTag from '@/components/tags/CommitteePositionTag'
import { CommitteeTag } from '@/components/tags/CommitteeTag'
import { StudentTag } from '@/components/tags/StudentTag'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Committee, { CommitteePosition } from '@/models/Committee'
import type { News } from '@/models/Items'
import Student, { StudentType } from '@/models/Student'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import DatateknikSVG from 'public/images/svg/datateknik.svg'
import KTHSVG from 'public/images/svg/kth.svg'
import MedieteknikSVG from 'public/images/svg/medieteknik.svg'
import THSSVG from 'public/images/svg/ths.svg'

interface Props {
  language: string
  news_data: News
}

/**
 * @name NewsDisplay
 * @description This is the news display component, it will render the news data
 *
 * @param {Props} props
 * @param {string} props.language - The language of the news
 * @param {News} props.news_data - The news data
 *
 * @returns {JSX.Element} The news display component
 */
export default function NewsDisplay({
  language,
  news_data,
}: Props): JSX.Element {
  let correctedAuthor = assignCorrectAuthor(news_data.author)
  if (!correctedAuthor) {
    return <div>Not found author</div>
  }
  let student_type: StudentType | false =
    correctedAuthor.author_type === 'STUDENT' &&
    (correctedAuthor as Student).student_type

  return (
    <>
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
              {news_data.translations[0].title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='flex flex-col items-center justify-start min-h-[1080px] h-fit px-4 sm:px-20 lg:px-0'>
        <div className='w-full lg:w-[700px] h-fit border-b-2 border-yellow-400 pb-1 mb-1'>
          <ul className='flex min-h-10 h-fit py-2'>
            {news_data.categories &&
              news_data.categories.map((category) => (
                <li className='px-2 py-1 border rounded-2xl' key={category}>
                  {category}
                </li>
              ))}
          </ul>
          <h1 className='text-4xl'>{news_data.translations[0].title}</h1>
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
            {new Date(news_data.created_at).toDateString()}
          </p>
          {news_data.last_updated && (
            <p className='text-sm mt-2'>
              <span className='font-bold'>Last updated: </span>
              {new Date(news_data.last_updated).toDateString()}
            </p>
          )}
        </div>
        <div className='w-full lg:w-[700px] my-4 mb-8'>
          <Body body={news_data.translations[0].body} />
        </div>
      </div>
    </>
  )
}
