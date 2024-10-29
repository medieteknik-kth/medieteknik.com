'use client'

import { useTranslation } from '@/app/i18n/client'
import CommitteeSelection from '@/components/dialogs/CommitteeSelection'
import CreateAlbum from '@/components/dialogs/CreateAlbum'
import MediaUpload from '@/components/dialogs/MediaUpload'
import SearchAlbum from '@/components/dialogs/SearchAlbum'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Album from '@/models/Album'
import Committee from '@/models/Committee'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { FolderPlusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { JSX, useEffect, useState } from 'react'

interface Props {
  language: string
}

/**
 * @name ToolbarAuth
 * @description The authenticated part of the media toolbar, allowing for media upload and album creation
 *
 * @param {Props} props
 * @param {string} props.language - The language of the page
 *
 * @returns {JSX.Element} The authenticated media toolbar
 */
export default function ToolbarAuth({ language }: Props): JSX.Element {
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false)
  const [selectAlbumDialogOpen, setSelectAlbumDialogOpen] = useState(true)
  const { student, committees } = useAuthentication()
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(
    null
  )
  const { t } = useTranslation(language, 'media')

  useEffect(() => {
    if (committees.length === 1) {
      setSelectedCommittee(committees[0])
    }
  }, [committees, setSelectedCommittee, selectedCommittee])

  if (!student && committees.length === 0) {
    return <></>
  }

  return (
    <div className='flex flex-wrap gap-2 items-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={'outline'}
            title='Upload Media'
            className='flex gap-2 items-center'
            onClick={() => {
              setSelectAlbumDialogOpen(true)
              setSelectedAlbum(null)
              if (committees.length > 1) {
                setSelectedCommittee(null)
              }
            }}
          >
            <PlusIcon className='h-6 w-6' />
            {t('upload_media')}
          </Button>
        </DialogTrigger>
        {!selectedCommittee && committees.length > 1 && (
          <CommitteeSelection
            language={language}
            callback={setSelectedCommittee}
          />
        )}

        {selectedCommittee && selectAlbumDialogOpen && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('select_album')}</DialogTitle>
              <DialogDescription>
                {t('select_album.description')}
              </DialogDescription>
            </DialogHeader>
            <SearchAlbum
              language={language}
              callback={(album) => {
                if (album) {
                  setSelectedAlbum(album)
                }
                setSelectAlbumDialogOpen(false)
              }}
            />
          </DialogContent>
        )}

        {selectedCommittee && !selectAlbumDialogOpen && (
          <MediaUpload
            language={language}
            author={{
              ...selectedCommittee,
              author_type: 'COMMITTEE',
            }}
            album={selectedAlbum}
            callback={() => {}}
          />
        )}
      </Dialog>
      <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
        <DialogTrigger asChild>
          <Button
            title='Create a new album'
            className='flex gap-2 items-center'
          >
            <FolderPlusIcon className='h-6 w-6' />
            {t('create_album')}
          </Button>
        </DialogTrigger>
        <CreateAlbum
          language={language}
          callback={() => setAlbumDialogOpen(false)}
        />
      </Dialog>
    </div>
  )
}
