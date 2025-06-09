import { Router } from "express";
import { container } from "tsyringe";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { IReportController } from "../controllers/Interface/IReportController";

const router = Router();
const reportController =
  container.resolve<IReportController>("ReportController");

const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer", "admin"]),
];

router
  .route("/")
  .post(...userAccess, (req, res, next) =>
    reportController.newReport(req, res, next)
  )
  .get(verifyAccessToken, authorizeRoles(["admin"]), (req, res, next) =>
    reportController.getAllReports(req, res, next)
  );

router.get("/my", ...userAccess, (req, res, next) =>
  reportController.getUserReports(req, res, next)
);

router.patch(
  "/:id/status",
  verifyAccessToken,
  authorizeRoles(["admin"]),
  (req, res, next) => reportController.updateReportStatus(req, res, next)
);

export default router;
