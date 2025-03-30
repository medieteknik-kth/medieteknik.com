import type { SearchResponse } from '@/api/search'
import {
  INDEXEDDB_NAME,
  INDEXEDDB_STORE_NAME,
  INDEXEDDB_VERSION,
  IS_DEVELOPMENT,
} from '@/utility/Constants'

/**
 * @name openDB
 * @description Opens the IndexedDB database and creates the object store if it doesn't exist
 *
 * @returns {Promise<IDBDatabase>} - The opened IndexedDB database
 * @throws {Error} - If there is an error opening the database
 */
async function openDB(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(INDEXEDDB_NAME, INDEXEDDB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(INDEXEDDB_STORE_NAME)) {
        db.createObjectStore(INDEXEDDB_STORE_NAME, { keyPath: 'key' })
      }
    }

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result)
    }

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error)
    }
  })
}

/**
 * @name updateTimestamp
 * @description Updates the timestamp for a given key in the IndexedDB, meant for faster lookup, than checking the entire search entry object for a metadata tag
 *
 * @param {IDBDatabase} db - The IndexedDB database instance
 * @param {string} key - The key to update the timestamp for
 *
 * @returns {Promise<void>} - A promise that resolves when the timestamp is updated
 * @throws {Error} - If there is an error updating the timestamp
 */
async function updateTimestamp(db: IDBDatabase, key: string): Promise<void> {
  const transaction = db.transaction(INDEXEDDB_STORE_NAME, 'readwrite')
  const store = transaction.objectStore(INDEXEDDB_STORE_NAME)
  const request = store.get(`${key}_timestamp`)
  request.onsuccess = (event) => {
    const result = (event.target as IDBRequest).result
    if (result) {
      const updated_at = new Date().toISOString()
      store.put({ key: `${key}_timestamp`, value: updated_at })
    } else {
      store.put({ key: `${key}_timestamp`, value: new Date().toISOString() })
    }
  }

  request.onerror = (event) => {
    console.error(
      'Error updating timestamp:',
      (event.target as IDBRequest).error
    )
  }
}

/**
 * @name getIndexedDBTimestamp
 * @description Retrieves the timestamp for a given key from the IndexedDB
 *
 * @param {string} key - The key to retrieve the timestamp for
 *
 * @returns {Promise<string | undefined>} - A promise that resolves to the timestamp or undefined if not found
 * @throws {Error} - If there is an error retrieving the timestamp
 */
export async function getIndexedDBTimestamp(
  key: string
): Promise<string | undefined> {
  const db = await openDB()
  const transaction = db.transaction(INDEXEDDB_STORE_NAME, 'readonly')
  const store = transaction.objectStore(INDEXEDDB_STORE_NAME)
  const request = store.get(`${key}_timestamp`)

  return new Promise<string | undefined>((resolve) => {
    request.onsuccess = (event) => {
      const result = (event.target as IDBRequest).result
      if (result) {
        resolve(result.value)
      } else {
        resolve(undefined)
      }
    }
    request.onerror = (event) => {
      console.error(
        'Error retrieving timestamp:',
        (event.target as IDBRequest).error
      )
      resolve(undefined)
    }
    transaction.oncomplete = () => {
      db.close()
    }
  })
}

/**
 * @name setIndexedDBSearchEntries
 * @description Saves the search entries to the IndexedDB
 *
 * @param {string} key - The key to save the search entries under
 * @param {SearchResponse | undefined} value - The search entries to save
 *
 * @returns {Promise<void>} - A promise that resolves when the data is saved
 * @throws {Error} - If there is an error saving the data
 */
export async function setIndexedDBSearchEntries(
  key: string,
  value: SearchResponse | undefined
): Promise<void> {
  if (!value) return

  const db = await openDB()
  const transaction = db.transaction(INDEXEDDB_STORE_NAME, 'readwrite')
  const store = transaction.objectStore(INDEXEDDB_STORE_NAME)
  const request = store.put({
    key,
    value,
  })
  // Update the timestamp
  await updateTimestamp(db, key)

  request.onsuccess = () => {
    if (IS_DEVELOPMENT) {
      console.log('Data saved successfully')
    }
  }
  request.onerror = (event) => {
    console.error('Error saving data:', (event.target as IDBRequest).error)
  }
  transaction.oncomplete = () => {
    db.close()
  }
}

/**
 * @name getIndexedDBSearchEntry
 * @description Retrieves the search entries from the IndexedDB
 *
 * @param {string} key - The key to retrieve the search entries for
 *
 * @returns {Promise<SearchResponse | undefined>} - A promise that resolves to the search entries or undefined if not found
 * @throws {Error} - If there is an error retrieving the data
 */
export async function getIndexedDBSearchEntry(
  key: string
): Promise<SearchResponse | undefined> {
  const db = await openDB()
  const transaction = db.transaction(INDEXEDDB_STORE_NAME, 'readonly')
  const store = transaction.objectStore(INDEXEDDB_STORE_NAME)
  const request = store.get(key)

  return new Promise<SearchResponse | undefined>((resolve) => {
    request.onsuccess = (event) => {
      const result = (event.target as IDBRequest).result
      if (result) {
        resolve(result.value as SearchResponse)
      } else {
        resolve(undefined)
      }
    }
    request.onerror = (event) => {
      console.error(
        'Error retrieving data:',
        (event.target as IDBRequest).error
      )
      resolve(undefined)
    }
    transaction.oncomplete = () => {
      db.close()
    }
  })
}
