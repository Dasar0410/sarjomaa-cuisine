import type { Metadata } from 'next'
import HomeClient from './_components/HomeClient'

export const metadata: Metadata = {
  title: 'SarjoMat - Enkle og gode oppskrifter',
  description: 'Finn enkle og gode oppskrifter på SarjoMat. Lag deilig middag med trinnvise oppskrifter.',
  alternates: { canonical: 'https://sarjomat.no' },
  openGraph: {
    title: 'SarjoMat - Enkle og gode oppskrifter',
    description: 'Finn enkle og gode oppskrifter på SarjoMat. Lag deilig middag med trinnvise oppskrifter.',
    url: 'https://sarjomat.no',
    images: ['https://sarjomat.no/sarjomat.png'],
  },
}

export default function Page() {
  return <HomeClient />
}
