import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Edit, Star, Trash2 } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { formatDateAndTime } from "../../utils/dateFormat";
import {
  deleteReview,
  getTrainerReviews,
  submitReview,
  updateReview,
} from "../../services/reviews/reviewService";
import { ReviewsSectionProps } from "../../types/review.types";
import ImageViewModal from "../modal/ImageViewModal";
import axios from "axios";
import ConfirmModal from "../modal/ConfirmModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const ReviewsSection = ({
  trainerId,
  isSubscribed,
}: ReviewsSectionProps) => {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updatingReview, setUpdatingReview] = useState(false);
  const [reviewId, setReviewId] = useState<string>("");
  const [activePage, setActivePage] = useState<number>(1);
  const limit = 3;
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["reviewsData", trainerId, activePage, limit],
    queryFn: () => getTrainerReviews(trainerId, activePage, limit),
  });

  const submitReviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      showToast("success", "Review submitted successfully!");
      setNewRating(0);
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["reviewsData", trainerId] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data.message ||
            "Failed to submit review. Please try again."
        );
      } else {
        showToast("error", "Failed to submit review. Please try again.");
      }
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      showToast("success", "Review updated successfully!");
      setNewRating(0);
      setNewComment("");
      setUpdatingReview(false);
      queryClient.invalidateQueries({ queryKey: ["reviewsData", trainerId] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data.message ||
            "Failed to update review. Please try again."
        );
      } else {
        showToast("error", "Failed to update review. Please try again.");
      }
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewsData", trainerId] });
      showToast("success", "Review deleted successfully!");
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data.message || "Failed to delete review."
        );
      } else {
        showToast("error", "Failed to delete review.");
      }
      setShowDeleteConfirm(false);
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

    if (updatingReview && reviewId) {
      updateReviewMutation.mutate({
        reviewId,
        rating: newRating,
        comment: newComment.trim(),
      });
      setUpdatingReview(false);
      setReviewId("");
      return;
    }

    submitReviewMutation.mutate({
      trainerId,
      rating: newRating,
      comment: newComment.trim(),
    });
  };

  const starRatingsMap = [
    { rating: 5, count: reviewsData?.ratingDistribution.fiveStarCount || 0 },
    { rating: 4, count: reviewsData?.ratingDistribution.fourStarCount || 0 },
    { rating: 3, count: reviewsData?.ratingDistribution.threeStarCount || 0 },
    { rating: 2, count: reviewsData?.ratingDistribution.twoStarCount || 0 },
    { rating: 1, count: reviewsData?.ratingDistribution.oneStarCount || 0 },
  ];

  const myReview = reviewsData?.myReview || null;
  const averageRating = reviewsData?.ratingDistribution.averageRating || 0;

  const totalPages = Math.ceil(
    (reviewsData?.ratingDistribution.totalReviews || 0) / limit
  );

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
              {reviewsData?.ratingDistribution?.totalReviews} review
              {reviewsData?.ratingDistribution?.totalReviews !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="flex-1">
            {starRatingsMap.map(({ rating, count }) => {
              const percentage =
                reviewsData?.ratingDistribution?.totalReviews ?? 0 > 0
                  ? (count / (reviewsData?.ratingDistribution?.totalReviews ?? 0)) * 100
                  : 0;
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-gray-700">{rating}</span>
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-gray-600 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Review Form - Only if subscribed */}
      {isSubscribed && (myReview === null || updatingReview) && (
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
              disabled={
                submitReviewMutation.isPending || updateReviewMutation.isPending
              }
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitReviewMutation.isPending
                ? "Submitting..."
                : updateReviewMutation.isPending
                ? "Updating..."
                : updatingReview
                ? "Update Review"
                : "Submit Review"}
            </motion.button>

            {updatingReview && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault();
                  setUpdatingReview(false);
                }}
                disabled={updateReviewMutation.isPending}
                className="bg-red-500 text-white px-6 py-2 ml-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                cancel
              </motion.button>
            )}
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
        ) : reviewsData?.reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No reviews yet. Be the first to review this trainer!</p>
          </div>
        ) : (
          reviewsData?.reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4 mb-2">
                {review.profilePicture && (
                  <img
                    src={review.profilePicture}
                    alt={`${review.username}'s profile`}
                    className="size-10 rounded-full object-cover border border-gray-200 hover:cursor-pointer"
                    onClick={() => setCurrentImageUrl(review.profilePicture)}
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{review.username}</h4>
                    {userId === review.userId && (
                      <div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewRating(review.rating);
                            setNewComment(review.comment);
                            setUpdatingReview(true);
                            setReviewId(review._id);
                          }}
                          className="p-1 text-blue-900 hover:text-black hover:bg-gray-300 rounded-full"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setReviewId(review._id);
                          }}
                          disabled={deleteReviewMutation.isPending}
                          className=" p-1 text-blue-900 hover:text-black hover:bg-gray-300 rounded-full"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    )}
                  </div>
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
                      {formatDateAndTime(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        )}

        {/* Pagination controls */}
        {reviewsData && reviewsData.ratingDistribution.totalReviews > limit && (
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setActivePage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={activePage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(activePage - 1) * limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      activePage * limit,
                      reviewsData.ratingDistribution.totalReviews
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {reviewsData.ratingDistribution.totalReviews}
                  </span>{" "}
                  reviews
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setActivePage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={activePage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (activePage <= 3) {
                      pageNum = idx + 1;
                      if (idx === 4) pageNum = totalPages;
                    } else if (activePage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = activePage - 2 + idx;
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setActivePage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          activePage === pageNum
                            ? "z-10 bg-purple-600 border-purple-600 text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setActivePage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={activePage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        <ImageViewModal
          imageUrl={currentImageUrl}
          onClose={() => setCurrentImageUrl(null)}
        />

        <ConfirmModal
          type="warning"
          title="Confirm Deletion"
          message={`Are you sure you want to delete this review?`}
          confirmText="Delete"
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => deleteReviewMutation.mutate(reviewId)}
          isConfirming={deleteReviewMutation.isPending}
        />
      </div>
    </div>
  );
};
