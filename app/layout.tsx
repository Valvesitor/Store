import type { Metadata } from 'next'
import { Cinzel, Inter, Oswald } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { TebexReturnHandler } from '@/components/tebex-return-handler'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
})
const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'The Wanted Sole Studio — Official Store',
  description:
    'Sistemas exclusivos para servidores RedM. Scripts, peds, systems, add-ons e recursos premium com qualidade, performance e suporte dedicado.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${oswald.variable} ${cinzel.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Script src="https://js.tebex.io/v/1.js" strategy="afterInteractive" />
        <TebexReturnHandler />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
