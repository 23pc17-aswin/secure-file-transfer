// Web Crypto API utility functions for zero-knowledge client-side encryption

// Constants
const SALT_SIZE = 16; // 16 bytes for PBKDF2 salt
const IV_SIZE = 12; // 12 bytes for AES-GCM IV
const ITERATIONS = 100000; // PBKDF2 iterations
const ALGORITHM = 'AES-GCM';

/**
 * Derives a cryptographic key from a password.
 */
async function deriveKey(password: string, salt: any): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a File and returns a combined buffer: [Salt (16)] + [IV (12)] + [Encrypted Data]
 */
export async function encryptFile(file: File, password: string): Promise<ArrayBuffer> {
  // Generate random Salt and IV
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_SIZE));

  // Derive key
  const key = await deriveKey(password, salt);

  // Read file as ArrayBuffer
  const fileBuffer = await file.arrayBuffer();

  // Encrypt with AES-GCM
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    fileBuffer
  );

  // Combine Salt, IV, and Encrypted Data into one payload array
  const finalPayload = new Uint8Array(SALT_SIZE + IV_SIZE + encryptedContent.byteLength);
  finalPayload.set(salt, 0); // 0 to 15
  finalPayload.set(iv, SALT_SIZE); // 16 to 27
  finalPayload.set(new Uint8Array(encryptedContent), SALT_SIZE + IV_SIZE); // 28 onwards

  return finalPayload.buffer;
}

/**
 * Decrypts a combined buffer using the provided password.
 */
export async function decryptFile(encryptedBuffer: ArrayBuffer, password: string): Promise<ArrayBuffer> {
  const encryptedView = new Uint8Array(encryptedBuffer);

  // Extract Salt and IV
  const salt = encryptedView.slice(0, SALT_SIZE);
  const iv = encryptedView.slice(SALT_SIZE, SALT_SIZE + IV_SIZE);
  const encryptedData = encryptedView.slice(SALT_SIZE + IV_SIZE);

  // Derive key using the extracted salt
  const key = await deriveKey(password, salt);

  // Decrypt data
  try {
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encryptedData
    );
    return decryptedContent;
  } catch (error) {
    throw new Error('Invalid password or corrupted file.');
  }
}
