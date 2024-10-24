import { GetCommitteePublic } from '@/api/committee'
import { GetMediaData } from '@/api/items'
import HeaderGap from '@/components/header/components/HeaderGap'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import Committee from '@/models/Committee'
import { MediaPagination } from '@/models/Pagination'
import {
  ChevronLeftIcon,
  PhotoIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import AlbumToolbar from './components/toolbar'
import Video from './components/video'

interface Params {
  language: string
  slug: string
}

interface Props {
  params: Promise<Params>
}

//TODO: Genrate static paths

export default async function Album(props: Props) {
  const { language, slug } = await props.params
  const committee_data: Committee | null = await GetCommitteePublic(
    slug,
    language
  )

  if (!committee_data || Object.keys(committee_data).length === 0) {
    return <></>
  }

  const album_data: MediaPagination | null = await GetMediaData(
    'sv',
    committee_data.committee_id
  )

  if (!album_data || Object.keys(album_data).length === 0) {
    return <></>
  }

  const videos = album_data.items.filter((item) => item.media_type === 'video')

  const images = album_data.items.filter((item) => item.media_type === 'image')

  return (
    <main>
      <HeaderGap />
      <Breadcrumb className='px-10 pt-4'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${language}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${language}/chapter`}>
              Chapter
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${language}/chapter/media`}>
              Media
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='capitalize'>
            <BreadcrumbLink href={`/${language}/chapter/media/${slug}`}>
              {slug}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className='px-10 py-4 border-b flex justify-between'>
        <div className='flex items-center gap-4'>
          <div className='rounded-full overflow-hidden bg-white'>
            <Avatar>
              <AvatarImage src={committee_data.logo_url} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className='text-3xl capitalize tracking-wide'>{slug}</h1>
            <p className='leading-tight tracking-wide text-neutral-600 dark:text-neutral-300'>
              Media
            </p>
          </div>
        </div>
        <div className='flex items-center'>
          <Button size={'icon'} variant={'secondary'}>
            <Link href={`/${language}/chapter/media`}>
              <ChevronLeftIcon className='w-6 h-6' />
            </Link>
          </Button>
        </div>
      </section>
      <AlbumToolbar language={language} slug={slug} />

      <section className='mx-10 pb-4 flex flex-col gap-2 mt-2'>
        {videos.length > 0 && (
          <>
            <div className='flex items-center gap-2 mt-1'>
              <VideoCameraIcon className='w-6 h-6' />
              <h3 className='text-lg font-semibold'>Videos</h3>
            </div>
            <ul className='h-[160px] flex flex-wrap gap-4 text-white'>
              {videos.map((item, index) => (
                <li
                  key={index}
                  className='w-72 h-[160px] border rounded-md transition-transform hover:scale-105 relative'
                >
                  <Image
                    src={item.media_url}
                    alt='thumbnail'
                    width={288}
                    height={162}
                    className='absolute top-0 left-0 w-full h-auto object-fill bottom-0 my-auto rounded-md'
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={'ghost'}
                        className='w-full h-full absolute top-0 left-0 hover:bg-transparent'
                      />
                    </DialogTrigger>
                    <Video />
                  </Dialog>
                  <div className='w-full h-full grid p-2 grid-cols-12 grid-rows-9'>
                    <div className='w-fit h-full col-start-11 col-span-2 row-span-2 p-1.5 bg-black/75 rounded-md z-10 place-self-end'>
                      <VideoCameraIcon className='h-full aspect-square' />
                    </div>
                    <div className='w-full h-full row-start-8 row-span-2 col-span-12 p-2 bg-black/75 rounded-md text-sm z-10 place-self-center overflow-hidden'>
                      <p>{item.translations[0].title}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {images.length > 0 && (
          <>
            <div className='flex items-center gap-2 mt-1'>
              <PhotoIcon className='w-6 h-6' />
              <h3 className='text-lg font-semibold'>Images</h3>
            </div>
            <ul className='flex flex-wrap gap-4 text-white'>
              {images.map((item, index) => (
                <li
                  key={index}
                  className='w-72 h-auto aspect-square border rounded-md transition-transform hover:scale-105 relative'
                >
                  <Image
                    src={item.media_url}
                    alt='thumbnail'
                    width={288}
                    height={288}
                    className='absolute top-0 left-0 w-72 aspect-square object-cover bottom-0 my-auto rounded-md'
                  />
                  <div className='w-full h-full grid p-2 grid-cols-8 grid-rows-8'>
                    <div className='w-full h-full col-start-8 p-1.5 bg-black/65 rounded-md z-10 place-self-center'>
                      <PhotoIcon />
                    </div>
                    <div className='w-full h-full row-start-8 col-span-8 p-2 bg-black/65 rounded-md text-sm z-10 place-self-center'>
                      <p>{item.translations[0].title}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  )
}
