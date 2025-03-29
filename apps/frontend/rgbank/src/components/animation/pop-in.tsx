import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { JSX } from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

/**
 * @name PopIn
 * @description A component that animates its children with a pop-in effect using framer-motion.
 * @param {Props} props - The props for the component.
 * @param {string} props.className - Optional class name for styling.
 * @param {React.ReactNode} props.children - The content to be animated.
 * @returns {JSX.Element} - The animated component.
 * @example
 * <PopIn className="my-class">
 *  <p>Hello, World!</p>
 * </PopIn>
 */
export function PopIn({ className, children }: Props): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
