import type { Metadata } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import { Suspense } from 'react'
import { PostHogProvider } from './posthog-provider'
import { PostHogPageView } from './posthog-pageview'
import './globals.css'

const playfair = Playfair_Display({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Inteligência Artificial/Real Diária — ZEITH Co',
  description: 'O maior portal de informações sobre IA para negócios locais. Atualizado diariamente às 06h, em 4 idiomas.',
  openGraph: {
    title: 'ZEITH Co | Inteligência Artificial/Real Diária',
    description: 'IA aplicada a negócios locais — curada diariamente por IA.',
    siteName: 'ZEITH Co Inteligência',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
