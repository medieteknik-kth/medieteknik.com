'use client'

import { subscribeUser } from '@/components/services/PushSubscription'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { IS_DEVELOPMENT } from '@/utility/Constants'
import type { JSX } from 'react'
import { useEffect, useState } from 'react'

/**
 * @name updateNotifications
 * @description Update the notification settings for the user
 *
 * @param {object} data - The notification settings to update
 * @param {string} data.iana - The IANA timezone string
 * @param {boolean} data.email - Whether to send email notifications
 * @param {boolean} data.push - Whether to send push notifications
 * @param {boolean} data.site_updates - Whether to send site update notifications
 * @param {Array} data.committees - The list of committees to send notifications for
 * @param {string} data.committees[].committee_id - The ID of the committee
 * @param {boolean} data.committees[].news - Whether to send news notifications for the committee
 * @param {boolean} data.committees[].event - Whether to send event notifications for the committee
 * @param {PushSubscription} notificationSubscription - The push subscription object
 *
 * @returns {Promise<void>} - A promise that resolves when the notification settings are updated
 * @throws {Error} - If the notification settings could not be updated
 */
async function updateNotifications(
  data: {
    iana: string
    email: boolean
    push: boolean
    site_updates: boolean
    committees: [
      {
        committee_id: string
        news: boolean
        event: boolean
      },
    ]
  },
  notificationSubscription: PushSubscription
): Promise<void> {
  const { email, push, iana, site_updates, committees } = data
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.API_URL
  try {
    const response = await fetch('/api/students/notifications', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email ?? false,
        push: push ?? false,
        subscription: notificationSubscription,
        preferences: {
          iana: iana ?? 'Europe/Stockholm',
          site_updates: site_updates ?? false,
          committees: committees ?? [],
        },
      }),
    })
    if (!response.ok) {
      throw new Error('Failed to update notifications')
    }
  } catch (error) {
    console.error('Failed to update notifications:', error)
  }
}

/**
 * @name ServiceWorkerRegister
 * @description Service worker registration component, used to register the service worker and handle push notifications and resubscribe dialog
 *
 * @returns {JSX.Element} - The service worker registration component
 */
export default function ServiceWorkerRegister(): JSX.Element {
  const [wasPreviouslySubscribed, setWasPreviouslySubscribed] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Service worker is not supported')
      return
    }

    const registerServiceWorker = async () => {
      try {
        const swUrl = new URL('/service-worker.js', window.location.origin).href
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: '/',
        })

        if (IS_DEVELOPMENT) {
          console.log('Service worker registered: ', registration)
        }

        if (window.matchMedia('(display-mode: standalone)').matches) {
          // Check if the app is running in standalone mode (PWA)
          // See the `manifest.ts` file for the PWA configuration
          if ('serviceWorker' in navigator && 'periodicSync' in registration) {
            // Register for periodic sync
            // NOTE: This is mainly available in a PWA app and only in some browsers:
            // https://developer.mozilla.org/en-US/docs/Web/API/Web_Periodic_Background_Synchronization_API#specifications
            navigator.serviceWorker.ready.then((periodicRegistration) => {
              if (!periodicRegistration.active) {
                console.warn('No active service worker found')
                return
              }

              periodicRegistration.active.postMessage({
                type: 'REGISTER_PERIODIC_SYNC',
              })
            })
          }
        }

        const subscription = await registration.pushManager.getSubscription()

        if (!subscription) {
          // If the user is not subscribed, we can check if they were previously subscribed
          // and show the resubscribe dialog
          const previousSubcription = localStorage.getItem(
            'notificationSettings'
          )

          if (previousSubcription) {
            const { push } = JSON.parse(previousSubcription)
            if (push) {
              setWasPreviouslySubscribed(true)
            }
          }
        }

        await registration.update()
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }

    registerServiceWorker()
  }, [])

  if (!wasPreviouslySubscribed) {
    return <></>
  }

  // This function is called when the user clicks the resubscribe button
  const handleResubscribe = async () => {
    const subscription = await subscribeUser()
    if (!subscription) {
      return
    }

    const data = localStorage.getItem('notificationSettings')
    if (!data) {
      throw new Error('Notification settings are missing')
    }

    updateNotifications(
      {
        ...JSON.parse(data),
      },
      subscription
    )
  }

  return (
    <AlertDialog
      open={wasPreviouslySubscribed}
      onOpenChange={setWasPreviouslySubscribed}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resubscribe to notifications?</AlertDialogTitle>
          <AlertDialogDescription>
            You were previously subscribed to notifications. Would you like to
            resubscribe?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              localStorage.removeItem('notificationSettings')
              setWasPreviouslySubscribed(false)
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleResubscribe}>
            Resubscribe
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
