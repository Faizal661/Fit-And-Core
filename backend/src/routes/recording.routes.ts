import multer from "multer";
import { Router } from "express";
import { container } from "tsyringe";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { IRecordingController } from "../controllers/Interface/IRecordingController";
import { NextFunction, Request, Response } from "express";

const router = Router();
const recordingController = container.resolve<IRecordingController>("RecordingController");

const upload = multer({ storage: multer.memoryStorage() });

function asyncHandler(fn: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer", "admin"]),
];

router.post(
  "/upload",
  ...userAccess,
  upload.single("video"),
  asyncHandler(recordingController.uploadRecording.bind(recordingController))
);

export default router;
