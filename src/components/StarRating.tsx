// @ts-ignore - no type declarations for react-rating
import RatingLib from 'react-rating'
import { Star } from 'lucide-react'

const Rating = RatingLib as any

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
}

function StarRating({ value, onChange, size = 24 }: StarRatingProps) {
  const interactive = !!onChange
  return (
    <Rating
      initialRating={value}
      readonly={!interactive}
      fractions={interactive ? 1 : 10}
      onChange={onChange}
      emptySymbol={<Star size={size} className='text-gray-300' />}
      fullSymbol={<Star size={size} className='text-yellow-400' fill='currentColor' />}
    />
  )
}

export default StarRating
