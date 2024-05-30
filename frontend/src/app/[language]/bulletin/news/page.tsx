import News from '@/models/Items'
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import NLGIcon from 'public/images/committees/nlg.png'
import BG from 'public/images/kth-landskap.jpg'
import BG2 from 'public/images/international_placeholder.jpg'
import BG3 from 'public/images/testbg.jpg'
import AllNews from './allNews'

const data: News[] = [
  {
    title: 'KTH:s rektor: "Vi har en plan för att öppna campus"',
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
    created_at: new Date('2021-09-01').toISOString(),
    body: '',
    is_pinned: false,
    is_public: true,
    published_status: 'PUBLISHED',
    url: '1',
  },
  {
    title: 'International students: "We need more support"',
    short_description:
      'International students at KTH are struggling with the lack of support.',
    main_image_url: BG2.src,
    author: {
      type: 'student',
      email: 'andree4@kth.se',
      first_name: 'André',
      last_name: 'Eriksson',
    },
    categories: ['International', 'Studentliv'],
    created_at: new Date('2021-09-03').toISOString(),
    body: '',
    is_pinned: false,
    is_public: true,
    published_status: 'PUBLISHED',
    url: '1',
  },
  {
    title: 'NLG planerar höstens första sittning',
    short_description: 'Planerna för höstens första sittning är i full gång.',
    main_image_url: BG3.src,
    author: {
      type: 'committee',
      title: 'NLG',
      logo_url: NLGIcon.src,
      email: 'nlg@medieteknik.com',
      description: '',
    },
    categories: ['Nöje', 'Fest'],
    created_at: new Date('2021-09-07').toISOString(),
    body: '',
    is_pinned: false,
    is_public: true,
    published_status: 'PUBLISHED',
    url: '1',
  },
]

export default function NewsPage({
  params: { language },
}: {
  params: { language: string }
}) {
  return (
    <main className='px-96'>
      <div className='h-24' />
      <h1 className='text-4xl py-10'>News</h1>
      <AllNews language={language} data={data} />
    </main>
  )
}
