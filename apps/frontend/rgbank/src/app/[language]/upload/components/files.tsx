import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FileDisplay from '@/components/ui/file-display'

interface Props {
  files: File[]
}

export default function FileOverview({ files }: Props) {
  return (
    <Card className='shadow-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-semibold leading-tight flex items-center gap-2'>
          Files
          <Badge variant='outline' className='ml-1 font-normal'>
            {files.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FileDisplay files={files} preview />
      </CardContent>
    </Card>
  )
}
