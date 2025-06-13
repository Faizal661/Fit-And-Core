import { Router } from "express";
import { container } from "tsyringe";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { IStreakController } from "../controllers/Interface/IStreakController";

const router = Router();
const streakController =
  container.resolve<IStreakController>("StreakController");

const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer"]), 
];


router.get("/overall", ...userAccess, (req, res, next) =>
  streakController.getOverallStreak(req, res, next)
);

router.get("/heatmap", ...userAccess, (req, res, next) =>
  streakController.getUserHeatmap(req, res, next)
);

router.post("/record-activity", ...userAccess, (req, res, next) =>
  streakController.recordUserActivity(req, res, next)
);


export default router;
