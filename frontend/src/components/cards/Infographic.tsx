import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

interface Props {
  card: InfoCard
}

interface InfoCard {
  title: string
  description: string
  icon: string
  href: string
  linkText: string
  ctaText: string
}

export default function InfographicCard({ card }: Props) {
  return (
    <Card className='h-full relative pb-14'>
      <CardHeader>
        <CardTitle>
          <Link
            href={`${card.href}`}
            title={card.linkText}
            rel={`${
              card.href !== 'https://metastudent.se/' ? 'me' : 'external'
            }`}
            className='h-fit flex flex-wrap p-0! gap-4 hover:underline items-center text-blue-600 dark:text-primary'
          >
            <Image
              src={card.icon}
              alt=''
              width={100}
              height={100}
              unoptimized={true} // Logos are SVGs, so they don't need to be optimized
              loading='lazy'
              placeholder='empty'
              className='w-16 h-16 aspect-square object-cover bg-white rounded-full p-2'
            />
            {card.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>{card.description}</CardContent>
      <CardFooter className='absolute bottom-0 left-0'>
        <Button variant={'ghost'} asChild>
          <Link
            href={`${card.href}`}
            title={card.linkText}
            rel={`${
              card.href !== 'https://metastudent.se/' ? 'me' : 'external'
            }`}
            className='flex items-center gap-2'
          >
            {card.ctaText}
            {card.href === 'https://metastudent.se/' ? (
              <ArrowTopRightOnSquareIcon className='w-4 h-4' />
            ) : (
              <ArrowRightIcon className='w-4 h-4' />
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
