'use client'

import { IS_DEVELOPMENT } from '@/utility/Constants'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export async function subscribeUser(): Promise<PushSubscription | undefined> {
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('Permission to notify was denied')
      return
    }

    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      throw new Error('VAPID public key is missing')
    }

    const registration = await navigator.serviceWorker.ready

    const existingSubscription =
      await registration.pushManager.getSubscription()
    if (existingSubscription) {
      await existingSubscription.unsubscribe()
      console.log('Unsubscribed from existing push subscription')
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      ),
    })

    const currentSubscription = await registration.pushManager.getSubscription()

    if (IS_DEVELOPMENT) {
      console.log('Verified subscription:', currentSubscription)
    }

    return subscription
  } catch (error) {
    console.error('Failed to subscribe the user:', error)
  }
}
