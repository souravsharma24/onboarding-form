import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ProgressProvider } from '@/contexts/ProgressContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Innovo Dashboard',
  description: 'Portfolio management and settlements dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <UserProvider>
            <ProgressProvider>
              {children}
            </ProgressProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


