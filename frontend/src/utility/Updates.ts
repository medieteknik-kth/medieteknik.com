import { SITE_VERSION } from '@/utility/Constants'

export const UPDATES = [
  {
    version: '0.6.1',
    date: '2024-12-22',
    title: 'UI Improvements',
    description: 'New UI, QOL and bug fixes',
  },
]

export class VersionControl {
  storageKey: string
  currentVersion: number

  constructor() {
    this.storageKey = 'lastSeenVersion'
    if (UPDATES[0].version !== SITE_VERSION) {
      throw new Error(
        'The latest update version does not match the current site version'
      )
    }
    this.currentVersion = this.convertVersionStringToNumber(UPDATES[0].version)
  }

  convertVersionStringToNumber(version: string) {
    const [major, minor, patch] = version.split('.').map(Number)
    return patch > 9
      ? major * 100 + minor * 10 + patch / 10
      : major * 100 + minor * 10 + patch
  }

  countUpdatesBehind() {
    const lastSeenVersion = Number.parseInt(
      localStorage.getItem(this.storageKey) || '0',
      10
    )

    for (let i = 0; i < UPDATES.length; i++) {
      if (
        this.convertVersionStringToNumber(UPDATES[i].version) <= lastSeenVersion
      ) {
        return UPDATES.length - i
      }
    }

    return UPDATES.length
  }

  checkForUpdates() {
    const lastSeenVersion = Number.parseInt(
      localStorage.getItem(this.storageKey) || '0',
      10
    )
    return lastSeenVersion < this.currentVersion
  }

  getNewUpdates() {
    const lastSeenVersion = Number.parseInt(
      localStorage.getItem(this.storageKey) || '0',
      10
    )
    return UPDATES.filter(
      (update) =>
        this.convertVersionStringToNumber(update.version) > lastSeenVersion
    )
  }

  markAsSeen() {
    localStorage.setItem(this.storageKey, this.currentVersion.toString())
  }
}
