import { useState } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Review, User as UserType } from "@/types/plugin";
import { motion } from "framer-motion";
import { usePluginStore } from "@/lib/store/plugin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PluginReviewsProps {
  pluginId: number;
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

export function PluginReviews({ pluginId }: PluginReviewsProps) {
  const currentUser = usePluginStore((state) => state.currentUser);
  const reviews = usePluginStore((state) => state.reviews);
  const addReview = usePluginStore((state) => state.addReview);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      const newReview: Review = {
        id: Date.now().toString(), // 转换为字符串以匹配 Review 接口
        userId: currentUser?.id || "匿名用户",
        rating,
        comment,
        pluginId,
        createdAt: new Date().toISOString(),
      };
      addReview(newReview);
      setRating(0);
      setComment("");
    }
  };

  const getRatingStats = () => {
    const total = reviews.length;
    const stats = Array(5).fill(0);
    reviews.forEach(review => stats[review.rating - 1]++);
    return stats.map(count => ({
      count,
      percentage: total ? (count / total) * 100 : 0
    }));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-8 p-4 bg-gray-800 rounded-lg shadow-lg dark:bg-gray-900"
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold mb-4 text-white dark:text-gray-200"
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
            className="mb-2 text-gray-200 bg-gray-700 focus:border-blue-500 dark:bg-gray-800"
            required
          />
          <Button type="submit" className="w-full">
            提交评价
          </Button>
        </motion.form>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-white">评分统计</h3>
        {getRatingStats().reverse().map((stat, index) => (
          <div key={5 - index} className="flex items-center mb-2">
            <span className="w-20 text-white">{5 - index} 星</span>
            <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-400 rounded-full h-2"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
            <span className="text-white w-20">{stat.count} 个评价</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">最新评价</SelectItem>
            <SelectItem value="highest">最高评分</SelectItem>
            <SelectItem value="lowest">最低评分</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="border-b pb-4"
            >
              <div className="flex items-center mb-2">
                <User className="w-6 h-6 mr-2 text-gray-400 dark:text-gray-500" />
                <span className="font-semibold text-white dark:text-gray-200">
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
              <p className="text-gray-200 dark:text-gray-300">
                {review.comment}
              </p>
            </motion.div>
          ))
        ) : (
          <motion.p
            variants={itemVariants}
            className="text-gray-400 dark:text-gray-500"
          >
            暂无评价。
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
