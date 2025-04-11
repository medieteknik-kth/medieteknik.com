'use client'

import { useInView, useMotionValue, useSpring } from 'motion/react'
import { type ComponentPropsWithoutRef, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import type { LanguageCode } from '@/models/Language'

interface NumberTickerProps extends ComponentPropsWithoutRef<'span'> {
  value: number
  language: LanguageCode
  startValue?: number
  direction?: 'up' | 'down'
  delay?: number
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  language,
  startValue = 0,
  direction = 'up',
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === 'down' ? startValue : value)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [motionValue, isInView, delay, value, direction, startValue])

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat(language, {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)))
        }
      }),
    [springValue, decimalPlaces, language]
  )

  return (
    <span
      ref={ref}
      className={cn(
        'inline-block tabular-nums tracking-normal text-black dark:text-white',
        className
      )}
      {...props}
    >
      {startValue}
    </span>
  )
}
