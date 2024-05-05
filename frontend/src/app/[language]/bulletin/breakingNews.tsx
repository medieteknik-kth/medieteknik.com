'use client'
import { Button } from '@/components/ui/button'
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import NLGIcon from 'public/images/committees/nlg.png'
import BG from 'public/images/kth-landskap.jpg'
import BG2 from 'public/images/international_placeholder.jpg'
import BG3 from 'public/images/testbg.jpg'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import ShortNews from './components/shortNews'
import { ShortNewsItem } from '@/models/Items'

const breakingNews: ShortNewsItem[] = [
  {
    id: 'news1',
    title: 'KTH:s rektor: "Vi har en plan för att öppna campus"',
    shortDescription:
      'KTH:s rektor Sigbritt Karlsson berättar om planerna för att öppna campus igen.',
    imageUrl: BG.src,
    author: {
      type: 'committee',
      name: 'Styrelsen',
      logoUrl: StyrelsenIcon.src,
      email: 'styrelsen@medieteknik.com',
    },
    categories: ['Skola'],
    creationDate: '2021-09-01',
  },
  {
    id: 'news2',
    title: 'International students: "We need more support"',
    shortDescription:
      'International students at KTH are struggling with the lack of support.',
    imageUrl: BG2.src,
    author: {
      type: 'student',
      email: 'andree4@kth.se',
      firstName: 'André',
      lastName: 'Eriksson',
      receptionName: 'N/A',
      profilePictureUrl: '',
    },
    categories: ['International', 'Studentliv'],
    creationDate: '2021-09-03',
  },
  {
    id: 'news3',
    title: 'Nöjesutskottet planerar höstens första sittning',
    shortDescription: 'Planerna för höstens första sittning är i full gång.',
    imageUrl: BG3.src,
    author: {
      type: 'committee',
      name: 'NLG',
      logoUrl: NLGIcon.src,
      email: 'nlg@medieteknik.com',
    },
    categories: ['Nöje', 'Fest'],
    creationDate: '2021-09-07',
  },
]
import { LinkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function BreakingNews({ language }: { language: string }) {
  const [copiedLink, setCopiedLink] = useState(-1)

  const handleCopyLink = (id: number) => {
    navigator.clipboard.writeText(window.location.href + '/' + id)
    setCopiedLink(id)
    setTimeout(() => {
      setCopiedLink(-1)
    }, 1000)
  }

  return (
    <div className='w-fit h-fit flex *:mr-16 z-10'>
      {breakingNews.map((newsItem, index) => (
        <div className='relative'>
          <ShortNews key={index} newsItem={newsItem} />
          <TooltipProvider>
            <Tooltip open={copiedLink === index}>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  title='Share'
                  aria-label='Share'
                  className='absolute bottom-4 right-4 z-10'
                  onClick={() => handleCopyLink(index)}
                >
                  <TooltipContent className='z-10'>Copied</TooltipContent>

                  <LinkIcon className='w-5 h-5' />
                </Button>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </div>
  )
}
