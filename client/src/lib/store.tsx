import React from 'react'
import { decrypt, encrypt, getKey } from "./crypto"

export type Entry = {
  title: string
  day: string
  content: string
}

type EncryptedEntry = {
  day: string
  payload: any
}

const DB_NAME = 'my-journal'
const DB_VERSION = 1
const ENTRIES_OBJECT_STORE = "entries"

type StoreContextProps = {
  initStore: (password: string) => Promise<void>
  resetStore: () => void,
  storeEntry: (entry: Entry) => Promise<void>
  storeEntries: (entries: Entry[]) => Promise<void>
  getEntry: (day: string) => Promise<Entry | undefined>
  getEntries: () => Promise<Entry[]>
  exportStore: () => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
}

const StoreContext = React.createContext<StoreContextProps>({
  initStore: () => Promise.reject(new Error('Not implemented')),
  resetStore: () => {},
  storeEntry: () => Promise.reject(new Error('Not implemented')),
  storeEntries: () => Promise.reject(new Error('Not implemented')),
  getEntry: () => Promise.reject(new Error('Not implemented')),
  getEntries: () => Promise.reject(new Error('Not implemented')),
  exportStore: () => Promise.reject(new Error('Not implemented')),
  changePassword: () => Promise.reject(new Error('Not implemented'))
})

export const DataStorage: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const db = React.useRef<IDBDatabase | undefined>(undefined)
  const dbKey = React.useRef<CryptoKey | undefined>(undefined)

  const initStore = (password: string): Promise<void> => {
    return new Promise((resolve, reject) => {

      const request = window.indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event: any) => {
        const resultDb: IDBDatabase = event.target.result
        db.current = resultDb

        db.current.createObjectStore(ENTRIES_OBJECT_STORE, { keyPath: "day" })
      }

      request.onerror = () => {
        reject(new Error('Error opening database'))
      }

      request.onsuccess = (event: any) => {
        db.current = event.target.result

        //getKey('abc123').then(async (key) => {
        getKey(password).then(async (key) => {
          dbKey.current = key
          resolve()
        })
      }
    })
  }

  const resetStore = () => {
    db.current = undefined
    dbKey.current = undefined
  }

  const storeEntry = (entry: Entry): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (!db.current) {
        return reject(new Error('No databaes'))
      }
      if (!dbKey.current) {
        return reject(new Error('No key provided'))
      }
      console.log('store...')

      console.log('add thingy to database')
      const encryptedEntry = await encrypt(dbKey.current, JSON.stringify(entry))
      const transaction = db.current.transaction([ENTRIES_OBJECT_STORE], "readwrite")

      transaction.onerror = (event) => {
        reject(new Error('Error creating transaction'))
      }

      transaction.oncomplete = () => {
        resolve()
      }

      const entriesObjectStore = transaction.objectStore(ENTRIES_OBJECT_STORE)
      console.log('doing add...')


      console.log('before put..', {
        day: entry.day,
        payload: encryptedEntry
      })
      const putRequest = entriesObjectStore.put({
        day: entry.day,
        payload: encryptedEntry
      })
      putRequest.onerror = (event: any) => {
        reject(new Error('Error putting data: ' + event.target.error))
      }
      putRequest.onsuccess = () => {
        // resolve()
      }

    })
  }

  const storeEntries = (entries: Entry[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (!db.current) {
        return reject(new Error('No databaes'))
      }
      if (!dbKey.current) {
        return reject(new Error('No key provided'))
      }
      console.log('store...', entries)

      const encryptedEntries: EncryptedEntry[] = []
      await Promise.all(entries.map(async (entry) => {
        if (!dbKey.current) {
          return reject(new Error('No key provided'))
        }
        encryptedEntries.push({
          day: entry.day,
          payload: await encrypt(dbKey.current, JSON.stringify(entry))
        })
      }))

      console.log('encrup entries', encryptedEntries)

      const transaction = db.current.transaction([ENTRIES_OBJECT_STORE], "readwrite")

      transaction.onerror = (event) => {
        reject(new Error('Error creating transaction'))
      }

      transaction.oncomplete = () => {
        resolve()
      }

      encryptedEntries.forEach((encryptedEntry) => {
        //return new Promise(async (resolve, reject) => {
        if (!dbKey.current) {
          return reject('No key provided')
        }
        const entriesObjectStore = transaction.objectStore(ENTRIES_OBJECT_STORE)
        console.log('doing add...')


        console.log('before put..', encryptedEntry)
        const putRequest = entriesObjectStore.put(encryptedEntry)
        /*
        putRequest.onerror = (event: any) => {
          reject(new Error('Error putting data: ' + event.target.error))
        }
        putRequest.onsuccess = () => {
          resolve()
        }
        */
      //})
      })
    })
  }

  const getEntry = (day: string): Promise<Entry | undefined> => {
    return new Promise((resolve, reject) => {
      if (!db.current) {
        return reject(new Error('No databaes'))
      }

      const transaction = db.current.transaction([ENTRIES_OBJECT_STORE], "readwrite")

      transaction.onerror = (event) => {
        reject(new Error('Error creating transaction'))
      }

      transaction.oncomplete = () => {

      }

      const entriesObjectStore = transaction.objectStore(ENTRIES_OBJECT_STORE)

      const getAllRequest = entriesObjectStore.get(day)

      getAllRequest.onerror = (event: any) => {
        reject(new Error('Error fetching all: ' + event.target.error))
      }

      getAllRequest.onsuccess = async (event: any) => {
        if (!dbKey.current) {
          return reject(new Error('No key provided'))
        }
        const result = event.target.result
        console.log('get reuslt', result)
        if (result !== undefined) {
          const decrypted = await decrypt(dbKey.current, result.payload)
          const entry: Entry = JSON.parse(decrypted)
          resolve(entry)
        } else {
          resolve(undefined)
        }
      }

    })
  }

  const getEntries = (): Promise<Entry[]> => {
    return new Promise((resolve, reject) => {
      if (!db.current) {
        return reject(new Error('No databaes'))
      }

      const transaction = db.current.transaction([ENTRIES_OBJECT_STORE], "readwrite")

      transaction.onerror = (event) => {
        reject(new Error('Error creating transaction'))
      }

      transaction.oncomplete = () => {

      }

      const entriesObjectStore = transaction.objectStore(ENTRIES_OBJECT_STORE)

      const getAllRequest = entriesObjectStore.getAll()

      getAllRequest.onerror = (event: any) => {
        reject(new Error('Error fetching all: ' + event.target.error))
      }

      getAllRequest.onsuccess = async (event: any) => {
        const result = event.target.result
        const decrypted: Entry[] = []
        await Promise.all(result.map(async (res: unknown) => {
          if ((res as EncryptedEntry).payload) {
            if (dbKey.current) {
              const payload = await decrypt(dbKey.current, (res as EncryptedEntry).payload)
              decrypted.push(JSON.parse(payload))
            }
          } else {
            decrypted.push(res as Entry)
          }
        }))
        resolve(decrypted)
      }

    })
  }

  const exportStore = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db.current) {
        return reject(new Error('No databaes'))
      }
      const transaction = db.current.transaction([ENTRIES_OBJECT_STORE], "readwrite")

      transaction.onerror = (event) => {
        reject(new Error('Error creating transaction'))
      }

      transaction.oncomplete = () => {

      }

      const entriesObjectStore = transaction.objectStore(ENTRIES_OBJECT_STORE)
      const getAllRequest = entriesObjectStore.getAll()

      getAllRequest.onerror = (event: any) => {
        reject(new Error('Error fetching all: ' + event.target.error))
      }

      getAllRequest.onsuccess = (event: any) => {
        const result = event.target.result
        console.log('get all result', result)

        const url = 'http://journal.swedishcolander.com/store'
        // const url = 'http://localhost:8080/store'
        fetch(url, {
          method: 'PUT',
          body: JSON.stringify(result),
          headers: {
            'content-type': 'application/json'
          }
        }).then(() => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }

  const changePassword = async (newPassword: string) => {
    const newKey = await getKey(newPassword)
    // First fetch with old key
    const entries = await getEntries()
    dbKey.current = newKey
    // Restore all entries with new key
    await storeEntries(entries)
  }

  return (
    <StoreContext.Provider value={{
      initStore,
      resetStore,
      storeEntry,
      storeEntries,
      getEntry,
      getEntries,
      exportStore,
      changePassword
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  return React.useContext(StoreContext)
}
