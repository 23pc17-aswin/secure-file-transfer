'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DownloadCloud, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DownloadPortalPage() {
  const router = useRouter();
  const [linkUrl, setLinkUrl] = useState('');
  const [error, setError] = useState('');

  const handleProceed = () => {
    try {
      if (!linkUrl.trim()) {
        setError('Please enter a secure link.');
        return;
      }
      
      const urlObject = new URL(linkUrl);
      
      // Ensure the URL they pasted actually belongs to our app (/download/[id]?name=file)
      if (urlObject.pathname.startsWith('/download/')) {
        // Just redirect them directly to that exact path + query string
        router.push(urlObject.pathname + urlObject.search);
      } else {
        throw new Error('Not a valid Secure Share download link.');
      }
    } catch (e) {
      setError('Invalid link format. Please paste the exact link provided to you.');
    }
  };

  return (
    <div className="glass-container">
      <div className="flex justify-center mb-4">
        <DownloadCloud size={64} style={{ color: 'var(--success)' }} />
      </div>
      <h1 className="title" style={{ fontSize: '2rem' }}>Receive a File</h1>
      <p className="subtitle mb-6 text-center">
        Paste your secure sharing link below to begin local decryption.
      </p>

      <div className="form-group mt-6">
        <label className="label">Secure Link URL</label>
        <input
          type="url"
          className="input"
          value={linkUrl}
          onChange={(e) => {
            setLinkUrl(e.target.value);
            setError('');
          }}
          placeholder="http://localhost:3000/download/..."
          onKeyDown={(e) => e.key === 'Enter' && handleProceed()}
        />
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <ShieldCheck size={14} /> Only valid Secure Share links will be accepted.
        </p>
      </div>

      <button className="button mt-6" onClick={handleProceed} disabled={!linkUrl.trim()}>
        Access Secure File <ArrowRight size={18} />
      </button>

      {error && (
        <div className="status-message status-error mt-4 text-center">
          {error}
        </div>
      )}

      <button 
        className="button mt-4" 
        style={{ background: 'transparent', border: '1px solid var(--surface-border)' }}
        onClick={() => router.push('/')}
      >
        Back to Home
      </button>
    </div>
  );
}
