import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/hooks/useAuth'
import { MobileNavigation } from '@/components/mobile/mobile-navigation'
import '@/styles/globals.css'
import '@/styles/mobile.css'

export const metadata: Metadata = {
  title: 'Radar da Voz - Plataforma de Talentos',
  description: 'Descubra, analise e monetize talentos vocais e criativos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Radar da Voz',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Radar da Voz" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err))
              }
            `,
          }}
        />
      </head>
      <body className="bg-dark-900 text-white">
        <AuthProvider>
          <MobileNavigation />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
