export type Entry = {
  title: string
  day: string
  content: string
}

type EncryptedEntry = {
  day: string
  payload: any
}

let memoryDb: Entry[] = []

const DB_NAME = 'my-journal'
const DB_VERSION = 1
const ENTRIES_OBJECT_STORE = "entries"
let db: IDBDatabase
let dbKey: CryptoKey
// let entriesObjectStore: IDBObjectStore

async function sha256(value: string): Promise<ArrayBuffer> {
  return await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  )
}

async function getKey(password: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'raw',
    await sha256(password),
    {name: 'AES-GCM'},
    false,
    ['encrypt', 'decrypt']
  )
}

const iv = crypto.getRandomValues(new Uint8Array(12))
console.log('iv is', iv)
// const ivStr = String.fromCharCode.apply(null, new Uint8Array(iv) as any)
const ivStr = ":&Q¯öû¯o»Q"
console.log('ivStr:"' + ivStr + '"')

async function encrypt(key: CryptoKey, data: string): Promise<string> {

  const encrypted = await crypto.subtle.encrypt(
    {
      iv: str2ab(ivStr),
      name: 'AES-GCM'
    },
    key,
    new TextEncoder().encode(data)
  )
  // return encrypted
  return String.fromCharCode.apply(null, new Uint8Array(encrypted) as any)
  // return btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted) as any))
  // return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  // return bufferToBase64(encrypted)
}

function str2ab(str: string): ArrayBuffer {
  var buf = new ArrayBuffer(str.length)
  var bufView = new Uint8Array(buf)
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

async function decrypt(key: CryptoKey, data: string): Promise<string> {
  //let asciiString = atob(data)
  //const bb = new Uint8Array(Array.from(asciiString).map(char => char.charCodeAt(0)));
  //console.log('bb', bb)
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        iv: str2ab(ivStr),
        name: 'AES-GCM'
      },
      key,
      str2ab(data)
    )
    return new TextDecoder().decode(decrypted)
  } catch (err) {
    console.log('eerr...', err)
    return ""
  }
}

export function initStore(password: string): Promise<void> {
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

      //getKey('abc123').then(async (key) => {
      getKey(password).then(async (key) => {
        dbKey = key

        const savedDb = window.localStorage.getItem(DB_NAME)
        if (savedDb) {
          const decrypted = await decrypt(key, savedDb)
          memoryDb = JSON.parse(decrypted)
        }

        resolve()
      })
    }
  })
}

export function storeEntry(entry: Entry): Promise<void> {
  return new Promise(async (resolve, reject) => {
    console.log('store...')

    const curEntry = memoryDb.find((e) => e.day === entry.day)
    if (curEntry) {
      memoryDb = memoryDb.map((e) => {
        if (e.day === entry.day) {
          return entry
        }
        return e
      })
    } else {
      memoryDb = [
        ...memoryDb,
        entry
      ]
    }

    const data = await encrypt(dbKey, JSON.stringify(memoryDb))
    // console.log('encrypted to save', data, JSON.stringify(memoryDb))
    window.localStorage.setItem(DB_NAME, data)


    //resolve()



    console.log('add thingy to database')
    const encryptedEntry = await encrypt(dbKey, JSON.stringify(entry))
    const transaction = db.transaction([ENTRIES_OBJECT_STORE], "readwrite")

    transaction.onerror = (event) => {
      reject(new Error('Error creating transaction'))
    }

    transaction.oncomplete = () => {

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
      resolve()
    }

  })
}

export function getEntry(day: string): Promise<Entry | undefined> {
  return new Promise((resolve, reject) => {
    /*
    const entry = memoryDb.find((entry) => entry.day === day)
    if (entry) {
      resolve(entry)
    } else {
      reject(new Error('Not found'))
    }
    */

    const transaction = db.transaction([ENTRIES_OBJECT_STORE], "readwrite")

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
      const result = event.target.result
      console.log('get reuslt', result)
      if (result !== undefined) {
        const decrypted = await decrypt(dbKey, result.payload)
        const entry: Entry = JSON.parse(decrypted)
        resolve(entry)
      } else {
        resolve(undefined)
      }
    }

  })
}

export function getEntries(): Promise<Entry[]> {
  return new Promise((resolve, reject) => {
    //resolve(JSON.parse(JSON.stringify(memoryDb)))

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

    getAllRequest.onsuccess = async (event: any) => {
      const result = event.target.result
      const decrypted: Entry[] = []
      await Promise.all(result.map(async (res: unknown) => {
        if ((res as EncryptedEntry).payload) {
          const payload = await decrypt(dbKey, (res as EncryptedEntry).payload)
          decrypted.push(JSON.parse(payload))
        } else {
          decrypted.push(res as Entry)
        }
      }))
      resolve(decrypted)
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
