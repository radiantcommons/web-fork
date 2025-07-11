/**
 * Native crypto utilities to replace WASM dependencies
 */

/**
 * Hashes data using SHA-256 via the native Web Crypto API
 */
export async function sha256Hash(data: Uint8Array): Promise<Uint8Array> {
  const hash = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hash);
}

/**
 * Hashes a string or Buffer using SHA-256 and returns hex string
 */
export async function sha256HashStr(input: string | Buffer): Promise<string> {
  let data: Uint8Array;
  if (typeof input === 'string') {
    const encoder = new TextEncoder();
    data = encoder.encode(input);
  } else {
    data = new Uint8Array(input);
  }
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
