
async function sha256(value: string): Promise<ArrayBuffer> {
  return await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  )
}

export async function getKey(password: string): Promise<CryptoKey> {
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

export async function encrypt(key: CryptoKey, data: string): Promise<string> {

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

export async function decrypt(key: CryptoKey, data: string): Promise<string> {
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
