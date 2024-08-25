'use client'
import DocumentUpload from '@/components/dialogs/DocumentUpload'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/AuthenticationProvider'
import { useDocumentManagement } from '@/providers/DocumentProvider'
import { useState } from 'react'

export default function SidebarAuth({ language }: { language: string }) {
  const [open, setOpen] = useState(false)
  const { student, permissions } = useAuthentication()
  const { addDocument } = useDocumentManagement()
  return (
    <>
      {student && permissions.author.includes('DOCUMENT') && (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Upload Document</Button>
            </DialogTrigger>
            <DocumentUpload
              language={language}
              addDocument={addDocument}
              author={student}
              closeMenuCallback={() => setOpen(false)}
            />
          </Dialog>
          <Separator className='-my-0.5' />
        </>
      )}
    </>
  )
}
