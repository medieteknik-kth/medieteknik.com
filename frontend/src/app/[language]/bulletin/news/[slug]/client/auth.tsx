import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import Committee from '@/models/Committee'
import { News } from '@/models/Items'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { API_BASE_URL } from '@/utility/Constants'
import { LinkIcon } from '@heroicons/react/24/outline'

interface Props {
  language: string
  news_data: News
}

export default function NewsAuth({ language, news_data }: Props): JSX.Element {
  const { toast } = useToast()
  const { student, committees } = useAuthentication()

  const deleteArticle = async () => {
    const encodedURL = encodeURIComponent(news_data.url)
    try {
      const response = await fetch(`${API_BASE_URL}/news/${encodedURL}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast({
          title: 'Article deleted',
          description: 'The article was successfully deleted.',
          duration: 2500,
        })
        window.location.href = `/${language}/bulletin/news`
      } else {
        toast({
          title: 'Error',
          description: 'An error occurred while deleting the article.',
          duration: 2500,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!student) {
    return <></>
  }

  if (news_data.author.author_type === 'COMMITTEE' && committees) {
    if (
      committees.some(
        (committee: Committee) =>
          committee.committee_id !==
          (news_data.author as Committee).committee_id
      )
    ) {
      return <></>
    }
  }

  return (
    <section className='xl:fixed w-full mb-4 xl:w-72 h-fit xl:right-8 xl:top-72'>
      <Card>
        <CardHeader>
          <CardTitle>Author Controls</CardTitle>
          <CardDescription>
            Last updated:{' '}
            <span>
              {new Date(
                news_data.last_updated || news_data.created_at
              ).toLocaleDateString(language)}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant='outline'
            title='Share'
            aria-label='Share'
            className='flex items-center gap-2'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast({
                title: 'Copied to clipboard',
                description: window.location.href,
                duration: 2500,
              })
            }}
          >
            <LinkIcon className='w-5 h-5' />
            <p>Share</p>
          </Button>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='w-full' variant={'destructive'}>
                Delete Article
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this article?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteArticle()
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </section>
  )
}
