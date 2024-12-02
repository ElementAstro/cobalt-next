import { useState } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Review, User as UserType } from "@/types/plugin";
import { motion } from "framer-motion";

interface PluginReviewsProps {
  reviews: Review[];
  onAddReview: (rating: number, comment: string) => void;
  currentUser: UserType | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function PluginReviews({
  reviews,
  onAddReview,
  currentUser,
}: PluginReviewsProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onAddReview(rating, comment);
      setRating(0);
      setComment("");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-8 p-4 bg-gray-800 rounded-lg shadow-lg dark:bg-gray-900"
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold mb-4 text-white"
      >
        评价
      </motion.h2>
      {currentUser && (
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="mb-6"
        >
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer h-6 w-6 ${
                  star <= rating ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="撰写你的评价..."
            className="mb-2 text-gray-200 bg-gray-700 focus:border-blue-500"
            required
          />
          <Button type="submit" className="w-full">
            提交评价
          </Button>
        </motion.form>
      )}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="border-b pb-4"
            >
              <div className="flex items-center mb-2">
                <User className="w-6 h-6 mr-2 text-gray-400" />
                <span className="font-semibold text-white">
                  {review.userId}
                </span>
              </div>
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= review.rating
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-200">{review.comment}</p>
            </motion.div>
          ))
        ) : (
          <motion.p variants={itemVariants} className="text-gray-400">
            暂无评价。
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
