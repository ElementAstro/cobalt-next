import { useState } from 'react'
import { Star, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Review, User as UserType } from '@/types/plugin'

interface PluginReviewsProps {
  reviews: Review[];
  onAddReview: (rating: number, comment: string) => void;
  currentUser: UserType | null;
}

export function PluginReviews({ reviews, onAddReview, currentUser }: PluginReviewsProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {currentUser && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="mb-2"
          />
          <Button type="submit">Submit Review</Button>
        </form>
      )}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center mb-2">
              <User className="w-6 h-6 mr-2" />
              <span className="font-semibold">{review.userId}</span>
            </div>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`${
                    star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

