export interface Review {
  _id: string;
  username: string;
  trainerId: string;
  profilePicture: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsSectionProps {
  trainerId: string;
  isSubscribed: boolean;
}

export interface SubmitReviewData {
  trainerId: string;
  rating: number;
  comment: string;
}

export interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}
