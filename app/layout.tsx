import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/hooks/useAuth'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Radar da Voz - Plataforma de Talentos',
  description: 'Descubra, analise e monetize talentos vocais e criativos',
  viewport: 'width=device-width, initial-scale=1.0',
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
        <meta name="theme-color" content="#9fd700" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
