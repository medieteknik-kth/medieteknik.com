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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import ShortNews from './components/shortNews'
import News from '@/models/Items'

const breakingNews: News[] = [
  {
    title: 'KTH:s rektor: "Vi har en plan för att öppna campus"',
    body: 'KTH:s rektor Sigbritt Karlsson berätar om planerna för att åpplösa campus igen.',
    is_pinned: false,
    is_public: true,
    published_status: 'PUBLISHED',
    url: '1',
    short_description:
      'KTH:s rektor Sigbritt Karlsson berättar om planerna för att öppna campus igen.',
    main_image_url: BG.src,
    author: {
      type: 'committee',
      title: 'Styrelsen',
      logo_url: StyrelsenIcon.src,
      email: 'styrelsen@medieteknik.com',
      description: '',
    },
    categories: ['Skola'],
    created_at: '2021-09-01',
  },
  {
    title: 'International students: "We need more support"',
    body: 'International students at KTH are struggling with the lack of support.',
    is_pinned: false,
    is_public: true,
    published_status: 'PUBLISHED',
    url: '2',
    short_description:
      'International students at KTH are struggling with the lack of support.',
    main_image_url: BG2.src,
    author: {
      type: 'student',
      email: 'andree4@kth.se',
      first_name: 'André',
      last_name: 'Eriksson',
      reception_name: 'N/A',
      profile_picture_url: '',
    },
    categories: ['Skola'],
    created_at: '2021-09-01',
  },
]
import { LinkIcon, TagIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

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
        <div key={index} className='relative'>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                title='News Tags'
                aria-label='News Tags'
                className='absolute bottom-4 right-16 z-10'
              >
                <TagIcon className='w-6 h-6' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='absolute w-fit h-fit'>
              <h3 className='text-lg font-bold pb-1'>Tags</h3>
              <div className='flex'>
                {newsItem.categories &&
                  newsItem.categories.map((category, index) => (
                    <Badge key={index} className='w-fit mr-2'>
                      {category}
                    </Badge>
                  ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  )
}
