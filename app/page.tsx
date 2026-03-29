'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, DownloadCloud, Shield } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="glass-container text-center" style={{ maxWidth: '600px' }}>
      <div className="flex justify-center mb-6">
        <Shield size={64} style={{ color: 'var(--primary)' }} />
      </div>
      
      <h1 className="title" style={{ fontSize: '2.5rem' }}>Secure Share</h1>
      <p className="subtitle" style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
        End-to-end encrypted file sharing. Zero knowledge. Absolute privacy.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        
        {/* Upload Card */}
        <div 
          onClick={() => router.push('/upload')}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--surface-border)',
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(99, 102, 241, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--surface-border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <UploadCloud size={40} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)' }}>Secure a File</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Encrypt and upload a file to share with others.</p>
        </div>

        {/* Download Card */}
        <div 
          onClick={() => router.push('/download')}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--surface-border)',
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--success)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--surface-border)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <DownloadCloud size={40} style={{ color: 'var(--success)' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)' }}>Receive a File</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Enter a secure link to download and decrypt a file.</p>
        </div>

      </div>
    </div>
  );
}
