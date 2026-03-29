'use client';

import React, { useState, useEffect } from 'react';
import { decryptFile } from '../../../lib/crypto';
import { DownloadCloud, KeyRound, Loader, ShieldCheck, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DownloadContent({ params }: { params: { id: string } }) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'decrypting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const fileName = searchParams.get('name') || 'decrypted_file';

  const handleDownload = async () => {
    if (!password) return;

    try {
      setStatus('fetching');
      setErrorMessage('');
      
      // Decode the Vercel Blob URL from the path param.
      // E.g., atob("aHR0cHM6...")
      const blobUrl = decodeURIComponent(atob(decodeURIComponent(params.id)));
      
      const response = await fetch(blobUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch the encrypted file from storage. It may have been deleted.');
      }

      const encryptedBuffer = await response.arrayBuffer();

      setStatus('decrypting');

      // Zero-knowledge client-side decryption
      const decryptedBuffer = await decryptFile(encryptedBuffer, password);

      // Create a Blob from the decrypted buffer and trigger a download
      const blob = new window.Blob([decryptedBuffer]);
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);

      setStatus('success');
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'Invalid password or file is corrupted.');
      setStatus('error');
    }
  };

  return (
    <div className="glass-container">
      <div className="flex justify-center mb-4">
         <ShieldCheck className="dropzone-icon" size={64} style={{color: 'var(--success)'}} />
      </div>
      <h1 className="title">Secure Download</h1>
      <p className="subtitle">Enter the password to decrypt and download.</p>

      {status !== 'success' && (
        <>
          <div className="file-info mb-6">
            <span className="file-name">{fileName}</span>
            <DownloadCloud size={20} color="var(--success)" />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password">Decryption Password</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                className="input"
                style={{paddingLeft: '2.5rem'}}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the secure password"
                disabled={status === 'fetching' || status === 'decrypting'}
              />
              <KeyRound className="absolute left-3 top-3 text-slate-400" size={18} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Decryption happens entirely in your browser.
            </p>
          </div>

          <button 
            className="button mt-6" 
            onClick={handleDownload}
            disabled={!password || status === 'fetching' || status === 'decrypting'}
          >
            {status === 'idle' || status === 'error' ? 'Decrypt & Download' : null}
            {status === 'fetching' && <><Loader className="animate-spin" size={20} /> Fetching file securely...</>}
            {status === 'decrypting' && <><Loader className="animate-spin" size={20} /> Decrypting locally...</>}
          </button>
        </>
      )}

      {status === 'success' && (
        <div className="text-center mt-4">
          <h2 className="title" style={{fontSize: '1.5rem', marginTop: '1rem'}}>Download Complete</h2>
          <p className="subtitle mt-2">The file has been decrypted and saved to your device.</p>
          
          <button 
             className="button mt-6" 
             style={{background: 'transparent', border: '1px solid var(--primary)'}}
             onClick={() => {
               setStatus('idle');
               setPassword('');
             }}
          >
             Download Again
          </button>
        </div>
      )}

      {status === 'error' && (
          <div className="status-message status-error flex items-center justify-center gap-2 mt-4">
             <AlertCircle size={18} /><span>{errorMessage}</span>
          </div>
      )}
    </div>
  );
}

export default function DownloadPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="glass-container"><Loader className="animate-spin text-center mx-auto" size={32} /></div>}>
      <DownloadContent params={params} />
    </Suspense>
  );
}
