'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { HTMLAttributes, JSX } from 'react'

type AnimationStyle = 'fade' | 'slide' | 'scale' | 'none'

interface AnimatedTabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  activeValue: string
  animationStyle?: AnimationStyle
}

/**
 * @name AnimatedTabsContent
 * @description A component that animates its children with a specified animation style using framer-motion.
 * @param {AnimatedTabsContentProps} props - The props for the component.
 * @param {string} props.value - The current value of the tab.
 * @param {string} props.activeValue - The active value of the tab.
 * @param {AnimationStyle} props.animationStyle - The animation style to be used. Default is 'fade'.
 * @param {string} props.className - Optional class name for styling.
 * @param {React.ReactNode} props.children - The content to be animated.
 * @returns {JSX.Element} - The animated component.
 * @example
 * <AnimatedTabsContent
 *  value={currentTab}
 *  activeValue='tab1'
 *  animationStyle='fade'
 *  className='my-4'
 * >
 *   <select className='my-select'>
 *     <option value='option1'>Option 1</option>
 *     <option value='option2'>Option 2</option>
 *   </select>
 * </AnimatedTabsContent>
 */
export function AnimatedTabsContent({
  value,
  activeValue,
  animationStyle = 'fade',
  className,
  children,
  ...props
}: AnimatedTabsContentProps): JSX.Element {
  const isActive = value === activeValue

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    slide: {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -20, opacity: 0 },
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
      transition: {},
    },
  }

  return (
    <div
      role='tabpanel'
      hidden={!isActive}
      className={cn(className)}
      {...props}
    >
      {isActive && (
        <motion.div
          initial={variants[animationStyle].initial}
          animate={variants[animationStyle].animate}
          exit={variants[animationStyle].exit}
          transition={variants[animationStyle].transition}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}
