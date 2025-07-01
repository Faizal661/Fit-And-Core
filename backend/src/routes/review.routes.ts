import { Router } from "express";
import { container } from "tsyringe";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { IReviewController } from "../controllers/Interface/IReviewController";

const router = Router();
const reviewController =
  container.resolve<IReviewController>("ReviewController");

const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer", "admin"]),
];

router
  .route("/")
  .post(...userAccess, (req, res, next) =>
    reviewController.submitReview(req, res, next)
  )
  .get(...userAccess, (req, res, next) =>
    reviewController.getTrainerReviews(req, res, next)
  )
  .patch(...userAccess, (req, res, next) =>
    reviewController.updateReview(req, res, next)
  )
  .delete(...userAccess, (req, res, next) =>
    reviewController.deleteReview(req, res, next)
  );

export default router;
