import type { Metadata } from 'next'
import RecipesListClient from '../_components/RecipesListClient'

export const metadata: Metadata = {
  title: 'Alle oppskrifter — SarjoMat',
  description: 'Utforsk alle oppskrifter på SarjoMat. Søk og filtrer blant enkle og gode middagsretter.',
  alternates: { canonical: 'https://sarjomat.no/oppskrifter' },
  openGraph: {
    title: 'Alle oppskrifter — SarjoMat',
    description: 'Utforsk alle oppskrifter på SarjoMat. Søk og filtrer blant enkle og gode middagsretter.',
    url: 'https://sarjomat.no/oppskrifter',
    images: ['https://sarjomat.no/sarjomat.png'],
  },
}

export default function Page() {
  return <RecipesListClient />
}
