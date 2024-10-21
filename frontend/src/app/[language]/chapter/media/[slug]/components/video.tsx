import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function Video() {
  return (
    <DialogContent className='!w-fit !h-fit'>
      <DialogHeader>
        <DialogTitle>Video</DialogTitle>
        <DialogDescription>
          Watch the video to learn more about the topic.
        </DialogDescription>
      </DialogHeader>
      <iframe
        width='462'
        height='260'
        src='https://www.youtube-nocookie.com/embed/'
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        referrerPolicy='strict-origin-when-cross-origin'
        allowFullScreen
      ></iframe>
    </DialogContent>
  )
}
