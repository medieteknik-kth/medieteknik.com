'use client'
import DocumentUpload from '@/components/dialogs/DocumentUpload'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useState } from 'react'

interface Props {
  language: string
}

export default function SidebarAuth({ language }: Props) {
  const [open, setOpen] = useState(false)
  const { student, permissions } = useAuthentication()
  return (
    <>
      {student &&
        permissions.author &&
        permissions.author.includes('DOCUMENT') && (
          <>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Upload Document</Button>
              </DialogTrigger>
              <DocumentUpload
                language={language}
                addDocument={() => {}}
                author={student}
                closeMenuCallback={() => {
                  setOpen(false)
                  window.location.reload()
                }}
              />
            </Dialog>
            <Separator className='-my-0.5' />
          </>
        )}
    </>
  )
}
