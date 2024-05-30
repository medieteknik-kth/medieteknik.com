import {
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline'
import { API_BASE_URL } from '@/utility/Constants'
import CommitteeMembers from './members'
import { Button } from '@/components/ui/button'
import Logo from 'public/images/logo.png'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { CommitteePosition } from '@/models/Committee'
import News from '@/models/Items'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import ShortNews from '@/app/[language]/bulletin/components/shortNews'
import { StudentCommitteePosition } from '@/models/Student'

interface Committee {
  category: string
  resource_id: number
  route: string
}

export async function generateStaticParams() {
  const res = await fetch(API_BASE_URL + '/dynamic/categories/committees')
  const committeesPages: Committee[] = await res.json()

  return committeesPages.map((committeePage) => ({
    language: '[language]',
    committee: committeePage.route.toLowerCase(),
  }))
}

//export const getStaticPaths: GetStaticPaths = async () => {
//  const res = await fetch(
//    'http://localhost:8000/api/v1/dynamic/categories/committees'
//  ).catch((error) => {
//    throw new Error('Failed to fetch data (Server is down?) \n' + error)
//  })
//  const committees: Committee[] = await res.json()
//
//  const paths = committees.map((committee) => ({
//    params: {
//      language: '[language]',
//      committee: committee.route.toLowerCase(),
//    },
//  }))
//
//  return { paths, fallback: true }
//}

type CommitteeProps = {
  committee_id: number
  email: string
  logo_url: string
  title: string
  description: string
}

async function getData(
  committee: string,
  language: string
): Promise<CommitteeProps> {
  const res = await fetch(
    `${API_BASE_URL}/committees/name/${committee}?language_code=${language}`
  )
  const data = await res.json()
  return data
}

interface CommitteePositionOccupant extends CommitteePosition {
  occupant: string
}

const committeeData: StudentCommitteePosition[] = [
  {
    student: {
      first_name: 'André',
      last_name: 'Eriksson',
      email: 'andree4@kth.se',
      type: 'student',
    },
    position: {
      title: 'Ordförande',
      active: true,
      description: 'Ordförande',
      email: 'ordforande@kth.se',
      role: 'ADMIN',
      weight: 1,
    },
    initiation_date: '2022-01-01',
    termination_date: '2022-01-01',
  },
  {
    student: {
      first_name: 'André',
      last_name: 'Eriksson',
      email: 'andree4@kth.se',
      type: 'student',
    },
    position: {
      title: 'Vice-Ordförande',
      active: true,
      description: 'Ordförande',
      email: 'ordforande@kth.se',
      role: 'ADMIN',
      weight: 1,
    },
    initiation_date: '2022-01-01',
    termination_date: '2022-01-01',
  },
  {
    student: {
      first_name: 'André',
      last_name: 'Eriksson',
      email: 'andree4@kth.se',
      type: 'student',
    },
    position: {
      title: 'Ordförande',
      active: true,
      description: 'Ordförande',
      email: 'ordforande@kth.se',
      role: 'ADMIN',
      weight: 1,
    },
    initiation_date: '2022-01-01',
    termination_date: '2022-01-01',
  },
  {
    student: {
      first_name: 'André',
      last_name: 'Eriksson',
      email: 'andree4@kth.se',
      type: 'student',
    },
    position: {
      title: 'Ordförande',
      active: true,
      description: 'Ordförande',
      email: 'ordforande@kth.se',
      role: 'ADMIN',
      weight: 1,
    },
    initiation_date: '2022-01-01',
    termination_date: '2022-01-01',
  },
  {
    student: {
      first_name: 'André',
      last_name: 'Eriksson',
      email: 'andree4@kth.se',
      type: 'student',
    },
    position: {
      title: 'Ordförande',
      active: true,
      description: 'Ordförande',
      email: 'ordforande@kth.se',
      role: 'ADMIN',
      weight: 1,
    },
    initiation_date: '2022-01-01',
    termination_date: '2022-01-01',
  },
  {
    student: {
      first_name: 'André',
      last_name: 'Eriksson',
      email: 'andree4@kth.se',
      type: 'student',
    },
    position: {
      title: 'Ordförande',
      active: true,
      description: 'Ordförande',
      email: 'ordforande@kth.se',
      role: 'ADMIN',
      weight: 1,
    },
    initiation_date: '2022-01-01',
    termination_date: '2022-01-01',
  },
]

export default async function Committee({
  params: { language, committee },
}: {
  params: { language: string; committee: string }
}) {
  const data = await getData(committee, language)

  const committeeName = decodeURIComponent(data.title)

  const newsData: News[] = [
    {
      title: 'News Title 1',
      author: {
        type: 'committee',
        title: committeeName.charAt(0).toUpperCase() + committeeName.slice(1),
        email: data.email,
        logo_url: Logo.src,
        description: '',
      },
      categories: ['Admin'],
      main_image_url: Logo.src,
      created_at: '2023-01-01',
      short_description: 'Short Description 1',
      body: '',
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      url: '',
    },
    {
      title: 'News Title 1',
      author: {
        type: 'committee',
        title: committeeName.charAt(0).toUpperCase() + committeeName.slice(1),
        email: data.email,
        logo_url: Logo.src,
        description: '',
      },
      categories: ['Admin'],
      main_image_url: Logo.src,
      created_at: '2023-01-01',
      short_description: 'Short Description 1',
      body: '',
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      url: '',
    },
    {
      title: 'News Title 1',
      author: {
        type: 'committee',
        title: committeeName.charAt(0).toUpperCase() + committeeName.slice(1),
        email: data.email,
        logo_url: Logo.src,
        description: '',
      },
      categories: ['Admin'],
      main_image_url: Logo.src,
      created_at: '2023-01-01',
      short_description: 'Short Description 1',
      body: '',
      is_pinned: false,
      is_public: true,
      published_status: 'PUBLISHED',
      url: '',
    },
  ]

  return (
    <main className='relative'>
      <div className='h-24 bg-black' />
      <Breadcrumb className='w-full h-fit mx-4 py-2 border-b border-neutral-400'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={'/' + language + '/chapter'}>
              Chapter
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={'/' + language + '/chapter/committees'}>
              Committees
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='capitalize'>
              {committeeName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className='w-full h-fit mt-12 flex justify-between'>
        <div className='w-fit h-full mx-16 flex flex-col justify-around'>
          <div className='flex flex-col items-center'>
            <Avatar className='w-48 h-48 rounded-full mb-4'>
              <AvatarImage
                src={data.logo_url || Logo.src}
                alt='Committee Logo'
                width={192}
                height={192}
              />
              <AvatarFallback>Committee Picture</AvatarFallback>
            </Avatar>
            <h1 className='uppercase text-3xl tracking-wider'>
              {committeeName}
            </h1>
            <Link
              href={`mailto:` + data.email}
              className='flex hover:underline underline-offset-4 decoration-yellow-400 decoration-2'
            >
              <h2>{data.email}</h2>
              <ArrowTopRightOnSquareIcon className='w-5 h-5 ml-2' />
            </Link>
            <div className='w-full h-12 my-2 grid grid-cols-6 auto-cols-fr grid-rows-1 place-items-center'>
              <Button
                asChild
                variant={'default'}
                size={'icon'}
                className='rounded-full w-12 h-12 col-start-3 grid place-items-center'
              >
                <Link
                  href='/'
                  className=''
                  title='Edit Page'
                  aria-label='Edit Page'
                >
                  <PencilSquareIcon className='w-8 h-8' />
                </Link>
              </Button>
              <Button
                asChild
                variant={'default'}
                size={'icon'}
                className='rounded-full w-12 h-12 grid place-items-center'
              >
                <Link
                  href={'./' + committeeName.toLowerCase() + '/manage'}
                  className=''
                  title='Edit Page'
                  aria-label='Edit Page'
                >
                  <Cog8ToothIcon className='w-8 h-8' />
                </Link>
              </Button>
            </div>
          </div>
          <div className='w-fit h-3/5 mt-4'>
            <h3 className='text-2xl tracking-wide pb-2 border-b-2 border-yellow-400 '>
              Members
            </h3>
            <CommitteeMembers language={language} committee={committee} />
          </div>
        </div>
        <div className='w-fit h-full grid place-items-end mr-96'>
          <div className='w-[900px] h-full flex flex-col items-center'>
            <div className='w-full h-[500px] bg-blue-500'></div>
            <p className='w-full py-12 px-10'>{data.description}</p>
          </div>
        </div>
      </section>

      <section>
        <div className='w-full h-fit px-16'>
          <h2 className='text-2xl border-b-2 border-yellow-400 py-4'>
            News & Events
          </h2>
          <div
            className='grid w-full h-fit grid-cols-3 
          auto-rows-auto auto-cols-auto py-4 '
          >
            {newsData.map((news, index) => (
              <ShortNews key={index} newsItem={news} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className='w-full h-fit px-16'>
          <div className='w-full border-b-2 border-yellow-400 py-4'>
            <Link
              href={
                '/' +
                language +
                '/chapter/committees/' +
                committeeName.toLowerCase() +
                '/positions'
              }
              className='w-fit h-auto block'
            >
              <h2 className='w-fit text-2xl'>Positions</h2>
            </Link>
          </div>
          <div className='grid grow h-full grid-cols-10 auto-rows-max auto-cols-auto gap-4 py-4 place-items-center'></div>
        </div>
      </section>
    </main>
  )
}
