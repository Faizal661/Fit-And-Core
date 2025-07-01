import api from "../../config/axios.config";
import { ReviewsData } from "../../types/review.types";

export const submitReview = async (data: {
  trainerId: string;
  rating: number;
  comment: string;
}) => {
  const response = await api.post("/reviews", data);
  return response.data;
};

export const getTrainerReviews = async (
  trainerId: string
): Promise<ReviewsData> => {
  try {
    const response = await api.get(`/reviews?trainerId=${trainerId}`);
    return response.data.result ;
  } catch (error) {
    console.error("Error fetching trainer reviews:", error);
    return {
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
    };
  }
};
