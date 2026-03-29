# 🔒 Secure Share (Zero-Knowledge File Transfer)

A state-of-the-art, end-to-end encrypted file sharing application built with **Next.js** and **Vercel Blob**. Designed with absolute privacy in mind, this application uses military-grade browser encryption so that the server (and server admins) never once see the plaintext files or the passwords. 

> **Live Demo:** *Replace with your Vercel Link here! (e.g. https://secure-file-transfer-five.vercel.app)*

---

## ✨ Features

- **Zero-Knowledge Architecture:** Files are fully encrypted utilizing the `Web Crypto API` (AES-GCM + PBKDF2) locally inside your device's memory *before* they are ever uploaded to the cloud.
- **Split Interface Layout:** A beautiful, responsive glassmorphic welcome screen that allows users to instantly choose between Uploading or Downloading a file.
- **Native Link Parsing:** A dedicated Download Portal detects your share link naturally without forcing users into ugly URL routing.
- **Stateless Storage:** Files are stored as pure, unreadable binary strings in the cloud. No user database or upload history is kept.
- **Auto-Fallback Engine:** Need to test locally without an internet connection? The app automatically routes uploads to your computer's local disk if no Vercel keys are provided!

---

## 🛠 How it Works

1. **Secure a File**: A user selects a file and enters a password. Their browser transforms the file into an encrypted binary blob and ships the blob directly into Vercel's Cloud Storage. The user receives a global **Secure Link**.
2. **Retrieve a File**: The recipient takes the Secure Link and pastes it into the Download Portal. They enter the password. Their browser fetches the raw blob, decrypts it locally, and saves the pristine file straight to their device. 

---

## 🚀 Quick Setup (Vercel & Local)

You do not need an `.env` file when hosting this live on Vercel! 

**1. Deploying to Vercel (Production)**
- Connect this repository to your Vercel account and hit Deploy.
- Go to your Vercel Project Dashboard → **Storage**, and click **Create Database (Vercel Blob)**.
- *That's it!* Vercel will instantly wire up the secure `BLOB_READ_WRITE_TOKEN` in the background, unlocking global file uploads seamlessly.

**2. Running Locally (Development)**
- Run `npm install`.
- Run `npm run dev` to start the local Next.js server.
- The app will automatically fall back to downloading directly to a `/public/uploads` folder on your computer for easy offline testing. 

---

## 🗑 Administrator Controls

Because this app prioritizes user anonymity and zero-knowledge storage, there is intentionally no Admin Login Portal on the website. 

To delete old files, simply log into your Vercel Dashboard, navigate to your Blob Storage, and use the graphical File Viewer to permanently delete the raw binary payloads!
