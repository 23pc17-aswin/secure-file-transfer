# Secure File Transfer System

A zero-knowledge, client-side encrypted file sharing application built with Next.js and Vercel Blob.
The server never sees the plaintext file or the password.

## How it works

1. **Upload**: User selects a file and types a password. The browser encrypts the file locally using the Web Crypto API (`AES-GCM` with a `PBKDF2` derived key). 
2. **Storage**: The encrypted binary payload is uploaded directly to Vercel Blob storage.
3. **Download**: A recipient receives a unique link. When they visit it and type the password, the encrypted blob is downloaded and decrypted locally in their browser.

## Setup Instructions

1. **Install dependencies**:
   Run `npm install` to install all packages.

2. **Configure Vercel Storage**:
   - Go to your Vercel Dashboard and open your project (or create a new one).
   - Go to the **Storage** tab and create a new **Vercel Blob** store.
   - Once created, go to the **.env.local** tab in the Blob store settings and copy the `BLOB_READ_WRITE_TOKEN`.
   - Create a `.env.local` file in the root of this repository and paste the token:
     ```
     BLOB_READ_WRITE_TOKEN="vercel_blob_rw_abc123..."
     ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy directly to Vercel by running `vercel` from the Vercel CLI, or simply pushing this repository to GitHub and importing it into Vercel. Ensure you link the Vercel Blob store to your Vercel project during deployment.
