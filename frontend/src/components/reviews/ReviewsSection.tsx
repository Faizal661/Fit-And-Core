import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/dateFormat";

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  trainerId: string;
  isSubscribed: boolean;
}

// Mock service functions - replace with your actual API calls
const getTrainerReviews = async (trainerId: string): Promise<Review[]> => {
  console.log("🚀 ~ getTrainerReviews ~ trainerId:", trainerId);
  // Mock data for demonstration
  return [
    {
      _id: "1",
      userId: "user1",
      userName: "John Doe",
      rating: 5,
      comment: "Excellent trainer! Very knowledgeable and supportive.",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      _id: "2",
      userId: "user2",
      userName: "Sarah Johnson",
      rating: 4,
      comment:
        "Great experience overall. Really helped me reach my fitness goals.",
      createdAt: "2024-01-10T14:20:00Z",
    },
  ];
};

const submitReview = async (data: {
  trainerId: string;
  rating: number;
  comment: string;
}) => {
  // Mock API call - replace with actual implementation
  console.log("Submitting review:", data);
  return { success: true };
};

export const ReviewsSection = ({
  trainerId,
  isSubscribed,
}: ReviewsSectionProps) => {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", trainerId],
    queryFn: () => getTrainerReviews(trainerId),
  });

  const reviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      showToast("success", "Review submitted successfully!");
      setNewRating(0);
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["reviews", trainerId] });
    },
    onError: () => {
      showToast("error", "Failed to submit review. Please try again.");
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      showToast("error", "Please select a rating");
      return;
    }
    if (newComment.trim().length < 10) {
      showToast("error", "Please write at least 10 characters");
      return;
    }
    reviewMutation.mutate({
      trainerId,
      rating: newRating,
      comment: newComment.trim(),
    });
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;


  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>

        {/* Rating Summary */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage =
                reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{rating}</span>
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-600">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Review Form - Only if subscribed */}
      {isSubscribed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100"
        >
          <h3 className="font-semibold mb-4">Add Your Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="text-2xl transition-colors duration-200"
                  >
                    <Star
                      className={`${
                        star <= (hoveredStar || newRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this trainer..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-transparent"
                rows={3}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {newComment.length}/500 characters
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={reviewMutation.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No reviews yet. Be the first to review this trainer!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{review.userName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={`${
                            star <= review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
