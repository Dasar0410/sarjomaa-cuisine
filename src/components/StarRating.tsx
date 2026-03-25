import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
}

function StarRating({ value, onChange, size = 24 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const interactive = !!onChange

  return (
    <div className='flex gap-1'>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value)
        return (
          <button
            key={star}
            type='button'
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              size={size}
              className={filled ? 'text-yellow-400' : 'text-gray-300'}
              fill={filled ? 'currentColor' : 'none'}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
