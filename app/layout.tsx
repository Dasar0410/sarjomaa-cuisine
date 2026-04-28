import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'SarjoMat - Enkle og gode oppskrifter',
  keywords: ['oppskrifter', 'matlaging', 'cuisine', 'mat', 'Sarjomaa', 'retter', 'middagstips'],
  authors: [{ name: 'SarjoMat' }],
  robots: { index: true, follow: true },
  icons: { icon: '/bread.svg' },
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
