import type { Metadata } from 'next'
import { Rajdhani } from 'next/font/google'
import './globals.css'

const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  weight: ['300', '500', '700'],
  variable: '--font-tech',
})

export const metadata: Metadata = {
  title: 'MERCS // TEMPORAL_ANCHOR',
  description: 'Timeline Analysis Engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={rajdhani.className}>{children}</body>
    </html>
  )
}
