'use client'

import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
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

  console.log(imageSrc)

  return imageSrc ? (
    <img
      src={imageSrc}
      alt={file.name}
      className='max-h-[30rem] object-cover'
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
    <div className='w-full flex flex-wrap mt-2 gap-2'>
      {files.map((file) => (
        <li
          key={`${file.name}-${file.size}`}
          className={`rounded-md w-fit h-fit px-4 flex items-center flex-wrap justify-between gap-2 bg-white border dark:bg-neutral-800 hover:scale-[101%] transition-transform duration-200 ease-in-out ${preview ? 'h-auto pt-4 pb-2' : 'py-2'}`}
        >
          <div
            className={`flex items-center gap-2 ${preview ? 'flex-col' : ''}`}
          >
            {preview ? (
              file.name.endsWith('.pdf') ? (
                <PDFPreview file={file} />
              ) : (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className='w-full h-auto rounded-md object-cover max-h-96'
                />
              )
            ) : file.name.endsWith('.pdf') && !preview ? (
              <DocumentTextIcon className='w-8 h-8 text-red-500' />
            ) : (
              <PhotoIcon className='w-8 h-8 text-gray-500' />
            )}

            <div className={`${preview ? 'self-start mt-auto' : ''}`}>
              <p className='text-sm'>{file.name}</p>
              <p className='text-xs text-muted-foreground'>
                {calculateFileSize(file.size)}
              </p>
            </div>
          </div>

          {children &&
            (typeof children === 'function'
              ? children(file)
              : isValidElement(children)
                ? cloneElement(children as React.ReactElement<{ file: File }>, {
                    file,
                  })
                : children)}
        </li>
      ))}
    </div>
  )
}
