import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
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
  const rawKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || '';
  const isKeyConfigured = rawKey.length > 0 && rawKey !== 'pk_test_Y2xlcmsuYXBpcnVuLmRldiQ' && !rawKey.includes('placeholder');

  const content = (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#050708] text-slate-100 font-sans antialiased selection:bg-[#00f2a9] selection:text-black"
      >
        {children}
      </body>
    </html>
  );

  if (!isKeyConfigured) {
    return content;
  }

  return (
    <ClerkProvider
      publishableKey={rawKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        variables: {
          colorPrimary: '#00f2a9',
          colorBackground: '#0b0f17',
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
