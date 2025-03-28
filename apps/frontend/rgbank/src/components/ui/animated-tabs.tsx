'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type * as React from 'react'

type AnimationStyle = 'fade' | 'slide' | 'scale' | 'none'

interface AnimatedTabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  activeValue: string
  animationStyle?: AnimationStyle
}

// This is a wrapper component for tab content that adds animations
export function AnimatedTabsContent({
  value,
  activeValue,
  animationStyle = 'fade',
  className,
  children,
  ...props
}: AnimatedTabsContentProps) {
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
