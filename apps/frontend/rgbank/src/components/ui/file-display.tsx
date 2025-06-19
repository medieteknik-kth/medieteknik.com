'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline'
import * as pdfjs from 'pdfjs-dist'
import {
  type JSX,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react'

interface Props {
  files: File[]
  preview?: boolean
  children?: React.ReactNode | ((file: File) => React.ReactNode)
}

interface PDFPreviewProps {
  file: File
}

/**
 * @name PDFPreview
 * @description Renders a PDF file as an image preview using pdfjs, ensure that the worker has been loaded
 * @param {file} - The PDF file to preview
 * @returns {JSX.Element} - The image preview of the PDF file
 */
const PDFPreview = ({ file }: PDFPreviewProps): JSX.Element => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const renderTaskRef = useRef<pdfjs.RenderTask | null>(null)

  useEffect(() => {
    if (!file) return
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.onload = async () => {
      if (!reader.result) return

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
      }

      const loadingTask = pdfjs.getDocument(
        new Uint8Array(reader.result as ArrayBuffer)
      )
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1)

      const viewport = page.getViewport({ scale: 1 })
      const canvas = document.createElement('canvas')
      if (!canvas) return
      const context = canvas.getContext('2d')
      if (!context) return
      canvas.width = viewport.width
      canvas.height = viewport.height
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }
      renderTaskRef.current = page.render(renderContext)
      await renderTaskRef.current.promise
      setImageSrc(canvas.toDataURL('image/png'))
    }

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
      }
    }
  }, [file])

  return imageSrc ? (
    <img
      src={imageSrc}
      alt={file.name}
      className='w-full rounded-md object-contain max-h-64'
    />
  ) : (
    <p>Loading Image</p>
  )
}

/**
 * @name calculateFileSize
 * @description Converts bytes to KB, MB, GB, etc. Example output: 1.23 MB
 * @param {number} size - The file size in bytes
 * @returns {string} - The file size in a human-readable format
 */
const calculateFileSize = (size: number): string => {
  // Convert bytes to KB, MB, GB, etc.
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let fileSize = size
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }
  return `${fileSize.toFixed(2)} ${units[unitIndex]}`
}

/**
 * @name FileDisplay
 * @description Displays a list of files with their names and sizes. If preview is true, it shows a preview of the file.
 * @param {Props} props - The properties for the FileDisplay component
 * @param {File[]} props.files - The list of files to display
 * @param {boolean} props.preview - Whether to show a preview of the file or not
 * @param {React.ReactNode | ((file: File) => React.ReactNode)} props.children - Optional children to render for each file
 * @returns {JSX.Element} - The rendered file display component
 */
export default function FileDisplay({
  files,
  preview,
  children,
}: Props): JSX.Element {
  return (
    <ScrollArea className='w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {files.map((file) => (
          <li
            key={`${file.name}-${file.size}`}
            className='rounded-lg border bg-card overflow-hidden flex flex-col'
          >
            <div className='relative aspect-video bg-muted/20 flex items-center justify-center overflow-hidden'>
              {preview ? (
                file.name.endsWith('.pdf') ? (
                  <PDFPreview file={file} />
                ) : file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file) || '/placeholder.svg'}
                    alt={file.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center w-full h-full'>
                    <div className='bg-primary/10 p-4 rounded-full'>
                      <DocumentIcon className='w-8 h-8 text-primary' />
                    </div>
                  </div>
                )
              ) : (
                <div className='flex items-center justify-center w-full h-full'>
                  <div className='bg-primary/10 p-4 rounded-full'>
                    {file.type.startsWith('image/') ? (
                      <PhotoIcon className='w-8 h-8 text-primary' />
                    ) : (
                      <DocumentIcon className='w-8 h-8 text-primary' />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className='p-3 flex justify-between flex-1'>
              <div>
                <h4
                  className='font-medium text-sm line-clamp-1'
                  title={file.name}
                >
                  {file.name}
                </h4>
                <p className='text-xs text-muted-foreground mt-1'>
                  {calculateFileSize(file.size)}
                </p>
              </div>

              {children &&
                (typeof children === 'function'
                  ? children(file)
                  : isValidElement(children)
                    ? cloneElement(
                        children as React.ReactElement<{ file: File }>,
                        {
                          file,
                        }
                      )
                    : children)}
            </div>
          </li>
        ))}
      </div>
    </ScrollArea>
  )
}
