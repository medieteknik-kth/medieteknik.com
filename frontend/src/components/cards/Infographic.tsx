import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  card: Card
}

interface Card {
  title: string
  description: string
  icon: string
  href: string
  linkText: string
}

export default function InfographicCard({ card }: Props) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>
          <Link
            href={`${card.href}`}
            title={card.linkText}
            rel={`${
              card.href !== 'https://metastudent.se/' ? 'me' : 'external'
            }`}
            className='h-fit flex flex-wrap !p-0 gap-4 hover:underline items-center text-blue-600 dark:text-primary'
          >
            <Image
              src={card.icon}
              alt=''
              width={100}
              height={100}
              loading='lazy'
              placeholder='empty'
              className='w-16 h-16 aspect-square object-cover bg-white rounded-full p-2'
            />
            {card.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>{card.description}</CardContent>
    </Card>
  )
}
