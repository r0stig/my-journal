export type Entry = {
  title: string
  day: string
  content: string
}

const DB_NAME = 'my-journal'
const DB_VERSION = 1
const ENTRIES_OBJECT_STORE = "entries"
let db: IDBDatabase
// let entriesObjectStore: IDBObjectStore

export function initStore(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event: any) => {
      db = event.target.result

      let entriesObjectStore = db.createObjectStore(ENTRIES_OBJECT_STORE, { keyPath: "day" })
    }

    request.onerror = () => {
      reject(new Error('Error opening database'))
    }

    request.onsuccess = (event: any) => {
      db = event.target.result
      resolve()
    }
  })
}

export function storeEntry(entry: Entry): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('add thingy to database')
    const transaction = db.transaction([ENTRIES_OBJECT_STORE], "readwrite")

    transaction.onerror = (event) => {
      reject(new Error('Error creating transaction'))
    }

    transaction.oncomplete = () => {

    }

    const entriesObjectStore = transaction.objectStore(ENTRIES_OBJECT_STORE)
    console.log('doing add...')

    const putRequest = entriesObjectStore.put(entry)
    putRequest.onerror = (event: any) => {
      reject(new Error('Error putting data: ' + event.target.error))
    }
    putRequest.onsuccess = () => {
      resolve()
    }
  })
}

export function exportStore(): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([ENTRIES_OBJECT_STORE], "readwrite")

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
      resolve(result)
    }
  })
}
