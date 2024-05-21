import {
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline'
import type { GetStaticPaths } from 'next'
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
import { ShortNewsItem } from '@/models/Items'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import ShortNews from '@/app/[language]/bulletin/components/shortNews'

interface Committee {
  category: string
  resource_id: number
  route: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(
    'http://localhost:8000/api/v1/dynamic/categories/committees'
  )
  const committees: Committee[] = await res.json()

  const paths = committees.map((committee) => ({
    params: {
      language: '[language]',
      committee: committee.route.toLowerCase(),
    },
  }))

  return { paths, fallback: true }
}

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
    `http://localhost:8000/api/v1/committees/name/${committee}?language_code=${language}`,
    { cache: 'force-cache' }
  )
  const data = await res.json()
  return data
}

interface CommitteePositionOccupant extends CommitteePosition {
  occupant: string
}

const committeeData: CommitteePositionOccupant[] = [
  {
    name: 'Ordförande',
    description: 'Ordförande',
    occupant: 'Viggo Halvarsson Skoog',
  },
  {
    name: 'Position',
    description: 'Vice-Ordförande',
    occupant: 'Member 2',
  },
  {
    name: 'Position',
    description: 'Member 3',
    occupant: 'Member 3',
  },
  {
    name: 'Position',
    description: 'Member 4',
    occupant: 'Member 4',
  },
  {
    name: 'Position',
    description: 'Member 5',
    occupant: 'Member 5',
  },
  {
    name: 'Position',
    description: 'Member 6',
    occupant: 'Vacant',
  },
]

export default async function Committee({
  params: { language, committee },
}: {
  params: { language: string; committee: string }
}) {
  const data = await getData(committee, language)

  const committeeName = decodeURIComponent(data.title)

  const newsData: ShortNewsItem[] = [
    {
      id: 'news-1',
      title: 'News Title 1',
      author: {
        type: 'committee',
        name: committeeName.charAt(0).toUpperCase() + committeeName.slice(1),
        email: data.email,
        logoUrl: Logo.src,
      },
      categories: ['Admin'],
      imageUrl: Logo.src,
      creationDate: '2023-01-01',
      shortDescription: 'Short Description 1',
    },
    {
      id: 'news-1',
      title: 'News Title 1',
      author: {
        type: 'committee',
        name: committeeName.charAt(0).toUpperCase() + committeeName.slice(1),
        email: committee + '@medieteknik.com',
        logoUrl: Logo.src,
      },
      categories: ['Admin'],
      imageUrl: Logo.src,
      creationDate: '2023-01-01',
      shortDescription: 'Short Description 1',
    },
    {
      id: 'news-1',
      title: 'News Title 1',
      author: {
        type: 'committee',
        name: committeeName.charAt(0).toUpperCase() + committeeName.slice(1),
        email: committee + '@medieteknik.com',
        logoUrl: Logo.src,
      },
      categories: ['Admin'],
      imageUrl: Logo.src,
      creationDate: '2023-01-01',
      shortDescription: 'Short Description 1',
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
          <div className='grid grow h-full grid-cols-10 auto-rows-max auto-cols-auto gap-4 py-4 place-items-center'>
            {committeeData.map((position, index) => (
              <Card key={index} className='min-w-56 w-fit h-44'>
                <CardHeader>
                  <CardTitle>{position.name}</CardTitle>
                  <CardDescription>
                    <HoverCard>
                      <HoverCardTrigger>
                        {position.occupant === 'Vacant' ? (
                          <span>{position.occupant}</span>
                        ) : (
                          <Button
                            variant='link'
                            className='px-0 text-neutral-600'
                          >
                            {position.occupant}
                          </Button>
                        )}
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <Button
                          asChild
                          variant='link'
                          className='h-fit flex flex-col justify-center pb-0'
                        >
                          <Link
                            href='/'
                            className='group'
                            title='Go to profile page'
                          >
                            <Avatar className='w-24 h-24 border-2 border-black rounded-full mb-2 group-hover:scale-110 transition-transform'>
                              <AvatarImage
                                src={Logo.src}
                                alt='Committee Logo'
                                width={96}
                                height={96}
                              />
                              <AvatarFallback>Committee Picture</AvatarFallback>
                            </Avatar>
                            <span>{position.occupant}</span>
                          </Link>
                        </Button>
                        <Button
                          variant='link'
                          className='text-neutral-500 py-0 w-full left-0 right-0 mx-auto z-10'
                        >
                          <Link href='mailto:' title='Send email to occupant'>
                            <span>andree4@kth.se</span>
                          </Link>
                        </Button>
                      </HoverCardContent>
                    </HoverCard>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(position.occupant === 'Vacant' && (
                    <Button
                      variant='default'
                      className='w-full'
                      title='Apply for position'
                    >
                      Apply
                    </Button>
                  )) || <></>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
