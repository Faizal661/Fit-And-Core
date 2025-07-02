import api from "../../config/axios.config";
import { ReviewsData } from "../../types/review.types";

export const submitReview = async (data: {
  trainerId: string;
  rating: number;
  comment: string;
}) => {
  try {
    const response = await api.post("/reviews", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export const getTrainerReviews = async (
  trainerId: string,
  activePage: number,
  limit: number
): Promise<ReviewsData> => {
  try {
    const response = await api.get(`/reviews?trainerId=${trainerId}&page=${activePage}&limit=${limit}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching trainer reviews:", error);
    return {
      reviews: [],
      myReview: null,
      ratingDistribution: {
        averageRating: 0,
        totalReviews: 0,
        fiveStarCount: 0,
        fourStarCount: 0,
        threeStarCount: 0,
        twoStarCount: 0,
        oneStarCount: 0,
      },
    };
  }
};

export const updateReview = async (data: {
  reviewId: string;
  rating: number;
  comment: string;
}) => {
  try {
    const response = await api.patch(`/reviews/${data.reviewId}`, {
      rating: data.rating,
      comment: data.comment,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};
