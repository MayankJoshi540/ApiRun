import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import '../index.css';

export const metadata: Metadata = {
  title: 'APIRun — Interactive Backend Engineering & API Practice Platform',
  description: 'Master API design, HTTP contracts, validation, idempotency, and distributed systems with real-time test verification.',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#050708] text-slate-100 font-sans antialiased selection:bg-white selection:text-black"
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
