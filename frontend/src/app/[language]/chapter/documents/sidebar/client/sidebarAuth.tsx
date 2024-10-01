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

/**
 * @name SidebarAuth
 * @description A component that displays the authenticated actions.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.language - The current language of the application.
 * @returns {JSX.Element} The JSX code for the SidebarAuth component.
 */
export default function SidebarAuth({ language }: Props): JSX.Element {
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
            <Separator />
          </>
        )}
    </>
  )
}
