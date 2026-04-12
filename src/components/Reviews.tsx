import { useState, useEffect } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserAuth } from '@/context/AuthContext'
import { Review } from '../types/review'
import { addReview, updateReview, deleteReview } from '../api/review'
import StarRating from './StarRating'
import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'

interface ReviewsProps {
  recipeId: number
  reviews: Review[]
  userReview: Review | null
}

function Reviews({ recipeId, reviews, userReview }: ReviewsProps) {
  const { session } = UserAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
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
    mutationFn: ({ r, c }: { r: number; c: string | null }) => addReview(recipeId, session!.user.id, r, c),
    onSuccess: invalidate,
    onError,
  })

  const updateMutation = useMutation({
    mutationFn: ({ r, c }: { r: number; c: string | null }) => updateReview(userReview!.id, r, c),
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

  function handleRatingChange(value: number) {
    setRating(value)
    setError(null)
    const vars = { r: value, c: userReview?.comment ?? null }
    if (userReview) {
      updateMutation.mutate(vars)
    } else {
      addMutation.mutate(vars)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (rating === 0) {
      setError('Velg en stjernebedømmelse.')
      return
    }
    const vars = { r: rating, c: comment || null }
    if (userReview) {
      updateMutation.mutate(vars)
    } else {
      addMutation.mutate(vars)
    }
  }


  return (
    <div className='shadow-lg p-8 md:mx-8 mx-4 mb-8 rounded-2xl bg-white'>
      <h2 className='text-2xl font-semibold mb-4'>Kommentarer</h2>

      {!session ? (
        <p className='text-gray-600 mb-6'>
          <button
            className='underline font-medium'
            onClick={() => { sessionStorage.setItem('redirectAfterLogin', pathname); navigate('/signin'); }}
          >Logg inn</button> for å legge igjen en anmeldelse.
        </p>
      ) : (
        <div className='mb-6'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Bedømmelse</label>
              <StarRating value={rating} onChange={handleRatingChange} size={28} />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kommentar <span className='text-gray-400 font-normal'>(valgfritt)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
                rows={1}
                maxLength={500}
                placeholder='Del dine tanker om oppskriften...'
                className='w-full border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring overflow-hidden'
              />
              <Button type='submit' disabled={isLoading} className='mt-2'>
                {isLoading ? 'Oppdaterer...' : 'Kommenter'}
              </Button>
            </div>

            {error && <p className='text-sm text-red-600'>{error}</p>}
          </form>
        </div>
      )}

      {reviews.filter(r => r.comment).length > 0 && (
        <div className='border-t pt-6 space-y-5'>
          {reviews.filter(r => r.comment).map((review) => (
            <div key={review.id} className='border-b pb-4 last:border-b-0'>
              <div className='flex items-center justify-between mb-1'>
                <StarRating value={review.rating} size={18} />
                <span className='text-xs text-gray-400'>
                  {new Date(review.created_at).toLocaleDateString('nb-NO')}
                </span>
              </div>
              <div className='flex items-start justify-between mt-2 gap-2'>
                <p className='text-gray-800'>{review.comment}</p>
                {review.id === userReview?.id && (
                  <button
                    type='button'
                    disabled={isLoading}
                    onClick={() => updateMutation.mutate({ r: userReview.rating, c: null })}
                    className='text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors shrink-0'
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              {review.profiles?.display_name && (
                <p className='text-sm text-gray-500 mt-1'>— {review.profiles.display_name}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reviews
