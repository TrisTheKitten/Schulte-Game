import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel'
})

export const metadata: Metadata = {
  title: 'Schulte Table Game',
  description: 'Train your brain with the Schulte Table cognitive exercise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={pressStart2P.variable}>{children}</body>
    </html>
  )
}
