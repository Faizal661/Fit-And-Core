export enum ERR_MESSAGES {
  CAUGHT_ERROR = "Caught an error:",
  SOMETHING_WENT_WRONG = "Oops! Something went wrong.",
  UNEXPECTED_ISSUE_TRY_AGAIN = "We've encountered an unexpected issue . Please try again later.",
  SERVER_ERROR = "Server error, please try again",
  NETWORK_ERROR = "Network error - server may be down",

  INTERCEPTOR_REQUEST_ERROR = "INTERCEPTOR REQUEST ERROR : ",
  INTERCEPTOR_RESPONSE_ERROR = "INTERCEPTOR RESPONSE ERROR : ",

  TRAINER_APPLICATION_SUBMIT_ERROR = "There was an error submitting your application. Please try again.",

  PAYMENT_ERROR = "Payment system error. Please try again.",

  UPVOTE_ARTICLE_ERROR = "Error upvoting article:",

  NOT_AN_IMAGE_ERROR = "Please upload an image file",
  MAX_IMAGE_SIZE_ERROR = "Image size should be less than 5MB",
  TIMEOUT_IMAGE_UPLOAD = "Image upload took too long. Please try again with a smaller image or check your internet connection.",
}
