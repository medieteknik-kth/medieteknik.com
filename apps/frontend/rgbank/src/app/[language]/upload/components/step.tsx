'use client'

import { cn } from '@/lib/utils'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from 'lucide-react'
import type React from 'react'

interface FormStepProps {
  /**
   * The title of the form step
   */
  title: string

  /**
   * Optional description of the form step
   */
  description?: string

  /**
   * The step number (1-based)
   */
  stepNumber: number

  /**
   * Whether the step is completed
   */
  isCompleted?: boolean

  /**
   * Whether the step is currently active
   */
  isActive?: boolean

  /**
   * Optional CSS class names
   */
  className?: string

  /**
   * The form content
   */
  children: React.ReactNode
}

export function FormStep({
  title,
  description,
  stepNumber,
  isCompleted = false,
  isActive = false,
  className,
  children,
}: FormStepProps) {
  return (
    <div
      className={cn(
        'space-y-4 bg-card p-6 rounded-lg border shadow-md',
        className
      )}
    >
      <div className='relative flex items-start gap-4'>
        <div className='flex-shrink-0'>
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isCompleted
                ? 'bg-primary/10'
                : isActive
                  ? 'bg-primary/10'
                  : 'bg-muted'
            )}
          >
            {isCompleted ? (
              <CheckIcon className='w-5 h-5 text-primary' />
            ) : (
              <span className='text-sm font-medium'>{stepNumber}</span>
            )}
          </div>

          {/* Vertical line connecting steps */}
        </div>

        <div className='flex-1 space-y-4'>
          <div>
            <h3 className='text-lg font-semibold leading-tight'>{title}</h3>
            {description && (
              <p className='text-sm text-muted-foreground mt-1'>
                {description}
              </p>
            )}
          </div>

          <div className='pl-0 sm:pl-2'>{children}</div>
        </div>

        {/* Status indicator for mobile */}
        <div className='flex sm:hidden'>
          {isCompleted && (
            <div className='bg-primary/10 p-1 rounded-full'>
              <CheckIcon className='w-4 h-4 text-primary' />
            </div>
          )}
          {!isCompleted && isActive && (
            <div className='bg-primary/10 p-1 rounded-full'>
              <span className='w-4 h-4 flex items-center justify-center text-xs font-medium text-primary'>
                {stepNumber}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface FormStepsProps {
  /**
   * Optional title for the form steps
   */
  title?: string

  /**
   * Optional description for the form steps
   */
  description?: string

  /**
   * Optional CSS class names
   */
  className?: string

  /**
   * Function to handle back button click
   */
  onBackClick?: () => void

  /**
   * Whether to show the back button
   * @default true when onBackClick is provided
   */
  showBackButton?: boolean

  /**
   * Optional label for the back button
   * @default "Back"
   */
  backButtonLabel?: string

  /**
   * The form steps content
   */
  children: React.ReactNode
}

export function FormSteps({
  title,
  description,
  className,
  onBackClick,
  showBackButton = !!onBackClick,
  backButtonLabel = 'Back',
  children,
}: FormStepsProps) {
  return (
    <div className={cn('space-y-8', className)}>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          {title && <h2 className='text-2xl font-bold'>{title}</h2>}
          {description && (
            <p className='text-muted-foreground'>{description}</p>
          )}
        </div>

        {showBackButton && onBackClick && (
          <button
            type='button'
            title={backButtonLabel}
            aria-label={backButtonLabel}
            className='inline-flex items-center gap-2 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-black px-3 py-2 rounded-md transition-colors cursor-pointer dark:text-white'
            onClick={onBackClick}
          >
            <ChevronLeftIcon className='w-4 h-4' />
            {backButtonLabel}
          </button>
        )}
      </div>

      <div className='space-y-8'>{children}</div>
    </div>
  )
}
