// e2e.ts — ECDH + AES-GCM skeleton. VERIFIED is false until audited.

export const VERIFIED = false

export interface KeyPair {
  publicKey: CryptoKey
  privateKey: CryptoKey
}

function subtle(): SubtleCrypto {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API haipatikani kwenye kifaa hiki.')
  }
  return crypto.subtle
}

export async function generateKeyPair(): Promise<KeyPair> {
  const kp = await subtle().generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey', 'deriveBits'])
  return { publicKey: kp.publicKey, privateKey: kp.privateKey }
}

export async function deriveSharedSecret(myPriv: CryptoKey, theirPub: CryptoKey): Promise<CryptoKey> {
  return subtle().deriveKey(
    { name: 'ECDH', public: theirPub },
    myPriv,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encrypt(plain: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = new TextEncoder().encode(plain)
  const buf = await subtle().encrypt({ name: 'AES-GCM', iv }, key, data)
  const out = new Uint8Array(iv.byteLength + buf.byteLength)
  out.set(iv, 0)
  out.set(new Uint8Array(buf), iv.byteLength)
  let bin = ''
  for (let i = 0; i < out.byteLength; i++) bin += String.fromCharCode(out[i])
  return btoa(bin)
}

export async function decrypt(cipher: string, key: CryptoKey): Promise<string> {
  const bin = atob(cipher)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  const iv = bytes.slice(0, 12)
  const data = bytes.slice(12)
  const buf = await subtle().decrypt({ name: 'AES-GCM', iv }, key, data)
  return new TextDecoder().decode(buf)
}
