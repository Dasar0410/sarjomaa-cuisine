import { Review } from '../types/review'
import StarRating from './StarRating'

interface ReviewListProps {
  reviews: Review[]
}

function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className='shadow-lg p-8 md:mx-8 mx-4 mb-4 rounded-2xl bg-white w-full lg:w-1/2'>
        <h2 className='text-2xl font-semibold mb-2'>Anmeldelser</h2>
        <p className='text-gray-500'>Ingen anmeldelser ennå. Vær den første!</p>
      </div>
    )
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <div className='shadow-lg p-8 md:mx-8 mx-4 mb-4 rounded-2xl bg-white w-full lg:w-1/2'>
      <h2 className='text-2xl font-semibold mb-2'>Anmeldelser</h2>

      <div className='flex items-center gap-3 mb-6'>
        <StarRating value={Math.round(average)} size={20} />
        <span className='text-lg font-semibold'>{average.toFixed(1)}</span>
        <span className='text-gray-500 text-sm'>({reviews.length} {reviews.length === 1 ? 'anmeldelse' : 'anmeldelser'})</span>
      </div>

      <div className='space-y-5'>
        {reviews.map((review) => (
          <div key={review.id} className='border-t pt-4'>
            <div className='flex items-center justify-between mb-1'>
              <StarRating value={review.rating} size={18} />
              <span className='text-xs text-gray-400'>
                {new Date(review.created_at).toLocaleDateString('nb-NO')}
              </span>
            </div>
            {review.comment && (
              <>
                <p className='text-gray-800 mt-2'>{review.comment}</p>
                {review.profiles?.display_name && (
                  <p className='text-sm text-gray-500 mt-1'>— {review.profiles.display_name}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewList
