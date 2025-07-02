export interface Review {
  _id: string;
  userId: string;
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

export interface RatingDistribution {
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface ReviewsData {
  reviews: Review[];
  myReview: Review | null;
  ratingDistribution: RatingDistribution;
}


export interface approvedTrainersWithRatings {
  _id: string;
  profilePicture: string;
  username: string;
  specialization: string;
  yearsOfExperience: string;
  rating: RatingDistribution
}
