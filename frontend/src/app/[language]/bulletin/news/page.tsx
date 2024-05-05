import { ShortNewsItem } from '@/models/Items'
import StyrelsenIcon from 'public/images/committees/styrelsen.png'
import NLGIcon from 'public/images/committees/nlg.png'
import BG from 'public/images/kth-landskap.jpg'
import BG2 from 'public/images/international_placeholder.jpg'
import BG3 from 'public/images/testbg.jpg'
import AllNews from './allNews'

const data: ShortNewsItem[] = [
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
    creationDate: new Date('2021-09-01').toISOString(),
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
    creationDate: new Date('2021-09-03').toISOString(),
  },
  {
    id: 'news3',
    title: 'NLG planerar höstens första sittning',
    shortDescription: 'Planerna för höstens första sittning är i full gång.',
    imageUrl: BG3.src,
    author: {
      type: 'committee',
      name: 'NLG',
      logoUrl: NLGIcon.src,
      email: 'nlg@medieteknik.com',
    },
    categories: ['Nöje', 'Fest'],
    creationDate: new Date('2021-09-07').toISOString(),
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
