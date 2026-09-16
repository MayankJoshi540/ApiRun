import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import '../index.css';

export const metadata: Metadata = {
  title: 'APIRun — Interactive Backend Engineering & API Practice Platform',
  description: 'Master API design, HTTP contracts, validation, idempotency, and distributed systems with real-time test verification.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#050708] text-slate-100 font-sans antialiased selection:bg-[#F8B81F] selection:text-black"
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
