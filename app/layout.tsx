import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stile - Evolution',
  description: 'How natural selection and random mutation work',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
