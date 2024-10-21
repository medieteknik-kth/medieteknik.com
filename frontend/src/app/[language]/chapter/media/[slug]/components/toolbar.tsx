import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline'

interface Props {
  language: string
  slug: string
}

export default function AlbumToolbar({ language, slug }: Props) {
  return (
    <section className='px-10 py-2 border-b flex'>
      <ToggleGroup type='multiple' defaultValue={['image', 'video']}>
        <ToggleGroupItem
          value='image'
          variant={'outline'}
          className='flex items-center gap-2'
        >
          <PhotoIcon className='w-5 h-5' />
          Images
        </ToggleGroupItem>
        <ToggleGroupItem
          value='video'
          variant={'outline'}
          className='flex items-center gap-2'
        >
          <VideoCameraIcon className='w-5 h-5' />
          Videos
        </ToggleGroupItem>
      </ToggleGroup>
    </section>
  )
}
