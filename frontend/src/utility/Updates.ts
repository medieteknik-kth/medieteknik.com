import type { Notification } from '@/models/Notification'

export const UPDATES: Notification[] = [
  {
    notification_id: '0.6.2',
    notification_type: 'update',
    created_at: new Date('2025-02-22').toISOString(),
    translations: [
      {
        language_code: 'sv',
        title: 'PWA, Mobilförbättringar',
        body: 'PWA-stöd, mobilförbättringar, buggfixar',
        url: '/updates/0.6.2',
      },
      {
        language_code: 'en',
        title: 'PWA, Mobile Improvements',
        body: 'PWA support, mobile improvements, bug fixes',
        url: '/updates/0.6.2',
      },
    ],
  },
  {
    notification_id: '0.6.1',
    notification_type: 'update',
    created_at: new Date('2024-12-22').toISOString(),
    translations: [
      {
        language_code: 'sv',
        title: 'UI-förbättringar',
        body: 'Ny UI, QOL och buggfixar',
        url: '/updates/0.6.1',
      },
      {
        language_code: 'en',
        title: 'UI Improvements',
        body: 'New UI, QOL and bug fixes',
        url: '/updates/0.6.1',
      },
    ],
  },
]
