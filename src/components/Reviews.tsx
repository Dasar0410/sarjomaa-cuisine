import { useState, useEffect } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { UserAuth } from '@/context/AuthContext'
import { Review } from '../types/review'
import { addReview, updateReview, deleteReview } from '../api/review'
import StarRating from './StarRating'
import { Button } from './ui/button'

interface ReviewsProps {
  recipeId: number
  reviews: Review[]
  userReview: Review | null
}

function Reviews({ recipeId, reviews, userReview }: ReviewsProps) {
  const { session } = UserAuth()
  const queryClient = useQueryClient()

  const [rating, setRating] = useState(userReview?.rating ?? 0)
  const [comment, setComment] = useState(userReview?.comment ?? '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setRating(userReview?.rating ?? 0)
    setComment(userReview?.comment ?? '')
  }, [userReview?.id])

  const onError = () => setError('Noe gikk galt. Prøv igjen.')
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['reviews', recipeId] })

  const addMutation = useMutation({
    mutationFn: () => addReview(recipeId, session!.user.id, rating, comment || null),
    onSuccess: invalidate,
    onError,
  })

  const updateMutation = useMutation({
    mutationFn: () => updateReview(userReview!.id, rating, comment || null),
    onSuccess: invalidate,
    onError,
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteReview(userReview!.id),
    onSuccess: () => {
      setRating(0)
      setComment('')
      invalidate()
    },
    onError,
  })

  const isLoading = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (rating === 0) {
      setError('Velg en stjernebedømmelse.')
      return
    }
    if (userReview) {
      updateMutation.mutate()
    } else {
      addMutation.mutate()
    }
  }


  return (
    <div className='shadow-lg p-8 md:mx-8 mx-4 mb-8 rounded-2xl bg-white'>
      <h2 className='text-2xl font-semibold mb-4'>Anmeldelser</h2>

      {/* Form / login prompt */}
      {!session ? (
        <p className='text-gray-600 mb-6'>
          <Link to='/signin' className='underline font-medium'>Logg inn</Link> for å legge igjen en anmeldelse.
        </p>
      ) : (
        <div className='mb-6'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Bedømmelse</label>
              <StarRating value={rating} onChange={setRating} size={28} />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kommentar <span className='text-gray-400 font-normal'>(valgfritt)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder='Del dine tanker om oppskriften...'
                className='w-full border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring'
              />
            </div>

            {error && <p className='text-sm text-red-600'>{error}</p>}

            <div className='flex gap-3'>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Lagrer...' : userReview ? 'Oppdater' : 'Send inn'}
              </Button>
              {userReview && (
                <Button
                  type='button'
                  variant='destructive'
                  disabled={isLoading}
                  onClick={() => deleteMutation.mutate()}
                >
                  Slett
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Other users' reviews */}
      {reviews.length > 0 && (
        <div className='border-t pt-6 space-y-5'>
          {reviews.map((review) => (
            <div key={review.id} className='border-b pb-4 last:border-b-0'>
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
      )}

      {reviews.length === 0 && (
        <p className='text-gray-500 text-sm'>Ingen anmeldelser ennå. Vær den første!</p>
      )}
    </div>
  )
}

export default Reviews
