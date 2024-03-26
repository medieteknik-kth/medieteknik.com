'use client'
import { useEffect } from 'react'
import { useState } from 'react'

/**
 * Temporary solution for copyrighted images, use regular imports when possible
 * @param src The image source in the public/images directory
 * @param fallbackColor The color to display if the image fails to load
 * @param metadata Optional metadata to specify the width and height of the image
 * @returns A div element with the image as the background
 * @deprecated Use regular imports when possible
 */
export const DynamicImage = ({
  src,
  fallbackColor,
  metadata,
}: {
  src: string
  fallbackColor: string
  metadata?: { width: number | string; height: number | string }
}) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Dynamically import the image
        const module = await import(`../../public/images/${src}`)
        setImageSrc(module.default.src)
        setLoadError(false) // Reset error state on successful load
      } catch (error) {
        // If there's an error, indicate that the image couldn't be loaded
        console.log('Failed to load image:', error)
        setLoadError(true)
      }
    }

    loadImage()
  }, [src])

  metadata = metadata || { width: '100%', height: '100%' }

  return (
    <div
      style={{
        width: metadata.width,
        height: metadata.height,
        backgroundColor: loadError ? fallbackColor : 'transparent', // Use the fallback color if there was an error
        backgroundImage: imageSrc ? `url(${imageSrc})` : 'none',
        backgroundSize: 'cover', // Ensure the image covers the area
        backgroundPosition: 'center', // Center the background image
      }}
    ></div>
  )
}
