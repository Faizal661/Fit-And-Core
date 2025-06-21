import { Router } from "express";
import { container } from "tsyringe";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { WalletController } from "../controllers/Implementation/wallet.controller";

const router = Router();
const walletController =
  container.resolve<WalletController>("WalletController");

const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer", "admin"]),
];

router
  .route("/")
  //   .post(...userAccess, upload.single("groupImage"), (req, res, next) =>
  //     groupController.createGroup(req, res, next)
  //   )
  .get(...userAccess, (req, res, next) =>
    walletController.getWalletData(req, res, next)
  );

export default router;
