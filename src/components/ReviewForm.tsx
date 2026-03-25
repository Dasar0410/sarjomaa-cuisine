import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { UserAuth } from '@/context/AuthContext'
import { Review } from '../types/review'
import { addReview, updateReview, deleteReview } from '../api/review'
import StarRating from './StarRating'
import { Button } from './ui/button'

interface ReviewFormProps {
  recipeId: number
  userReview: Review | null
}

function ReviewForm({ recipeId, userReview }: ReviewFormProps) {
  const { session } = UserAuth()
  const queryClient = useQueryClient()

  const [rating, setRating] = useState(userReview?.rating ?? 0)
  const [comment, setComment] = useState(userReview?.comment ?? '')
  const [error, setError] = useState<string | null>(null)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['reviews', recipeId] })

  const addMutation = useMutation({
    mutationFn: () => addReview(recipeId, session!.user.id, rating, comment || null),
    onSuccess: invalidate,
    onError: () => setError('Noe gikk galt. Prøv igjen.'),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateReview(userReview!.id, rating, comment || null),
    onSuccess: invalidate,
    onError: () => setError('Noe gikk galt. Prøv igjen.'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteReview(userReview!.id),
    onSuccess: () => {
      setRating(0)
      setComment('')
      invalidate()
    },
    onError: () => setError('Noe gikk galt. Prøv igjen.'),
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

  if (!session) {
    return (
      <div className='shadow-lg p-8 md:mx-8 mx-4 mb-8 rounded-2xl bg-white w-full lg:w-1/2'>
        <p className='text-gray-600'>
          <Link to='/signin' className='underline font-medium'>Logg inn</Link> for å legge igjen en anmeldelse.
        </p>
      </div>
    )
  }

  return (
    <div className='shadow-lg p-8 md:mx-8 mx-4 mb-8 rounded-2xl bg-white w-full lg:w-1/2'>
      <h2 className='text-2xl font-semibold mb-4'>
        {userReview ? 'Din anmeldelse' : 'Legg igjen en anmeldelse'}
      </h2>

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
  )
}

export default ReviewForm
