import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure File Transfer',
  description: 'Zero-knowledge client-side encrypted file sharing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="main-layout">{children}</main>
      </body>
    </html>
  );
}
