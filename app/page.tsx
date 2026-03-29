'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { encryptFile } from '../lib/crypto';
import { UploadCloud, CheckCircle, Copy, Loader, ShieldAlert } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'encrypting' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file || !password) return;

    try {
      setStatus('encrypting');
      
      // Zero-knowledge client-side encryption
      const encryptedBuffer = await encryptFile(file, password);
      
      setStatus('uploading');

      // Append original file metadata as part of the filename query param so it can be reconstructed
      const originalExtension = file.name.split('.').pop() || 'bin';
      const safeFilename = encodeURIComponent(`enc_${Date.now()}.${originalExtension}`);
      
      // Upload raw encrypted binary buffer to Vercel string
      const response = await fetch(`/api/upload?filename=${safeFilename}`, {
        method: 'POST',
        body: encryptedBuffer,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const blobData = await response.json();
      
      // The blobData object should have a `url` property pointing to the Vercel Blob URL.
      // E.g., https://my-store.public.blob.vercel-storage.com/enc_12345.bin
      if (blobData.url) {
        // Construct standard share url
        const currentDomain = window.location.origin;
        // encode blob url to pass easily in download param
        const targetUrl = `${currentDomain}/download/${encodeURIComponent(btoa(blobData.url))}?name=${encodeURIComponent(file.name)}`;
        setDownloadUrl(targetUrl);
        setStatus('success');
      } else {
         throw new Error('No URL returned from blob API');
      }

    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setStatus('error');
    }
  };

  const copyToClipboard = () => {
    if (downloadUrl) {
      navigator.clipboard.writeText(downloadUrl);
      alert('Secure link copied to clipboard!');
    }
  };

  return (
    <div className="glass-container">
      <h1 className="title">Secure Share</h1>
      <p className="subtitle">Client-side encryption. Zero-knowledge transfer.</p>

      {status !== 'success' && (
        <>
          <div 
            className={`dropzone mb-6 ${file ? 'active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="dropzone-icon" size={48} />
            {file ? (
              <div className="file-info w-full" onClick={(e) => e.stopPropagation()}>
                 <span className="file-name">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                 <button onClick={() => setFile(null)} className="text-white hover:text-red-400">✕</button>
              </div>
            ) : (
              <p>Drag and drop your file here, or click to browse</p>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password">Encryption Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              disabled={status === 'encrypting' || status === 'uploading'}
            />
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <ShieldAlert size={14} /> Password is never sent to the server.
            </p>
          </div>

          <button 
            className="button mt-6" 
            onClick={handleUpload}
            disabled={!file || !password || status === 'encrypting' || status === 'uploading'}
          >
            {status === 'idle' || status === 'error' ? 'Encrypt & Upload' : null}
            {status === 'encrypting' && <><Loader className="animate-spin" size={20} /> Encrypting locally...</>}
            {status === 'uploading' && <><Loader className="animate-spin" size={20} /> Uploading securely...</>}
          </button>
        </>
      )}

      {status === 'success' && (
        <div className="text-center mt-4">
          <div className="flex justify-center mb-4">
            <CheckCircle color="var(--success)" size={64} />
          </div>
          <h2 className="title" style={{fontSize: '1.5rem'}}>File Secured</h2>
          <p className="subtitle mt-2">Your file is encrypted and safely uploaded.</p>
          
          <div className="form-group mt-6 text-left">
             <label className="label">Secure Link</label>
             <div className="copy-area">
               <input type="text" className="input" readOnly value={downloadUrl} />
               <button className="copy-btn" onClick={copyToClipboard} title="Copy Link">
                 <Copy size={20} />
               </button>
             </div>
             <p className="text-xs text-slate-400 mt-2">Share this link and your password with the recipient.</p>
          </div>
          
          <button 
             className="button mt-4" 
             style={{background: 'transparent', border: '1px solid var(--primary)'}}
             onClick={() => {
               setStatus('idle');
               setFile(null);
               setPassword('');
               setDownloadUrl('');
             }}
          >
             Upload Another
          </button>
        </div>
      )}

      {status === 'error' && (
          <div className="status-message status-error">
             {errorMessage}
          </div>
      )}
    </div>
  );
}
