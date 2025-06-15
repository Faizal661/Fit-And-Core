import { Router } from "express";
import { container } from "tsyringe";
import { upload } from "../utils/multer.util";
import { verifyAccessToken } from "../middlewares/verify-token.middleware";
import { checkBlockedUser } from "../middlewares/check-blocked-user.middleware";
import { authorizeRoles } from "../middlewares/role-based-access-control.middleware";
import { GroupController } from "../controllers/Implementation/group.controller";

const router = Router();
const groupController = container.resolve<GroupController>("GroupController");

const adminAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["admin"]),
];

const userAccess = [
  verifyAccessToken,
  checkBlockedUser,
  authorizeRoles(["user", "trainer", "admin"]),
];

router
  .route("/")
  .post(...adminAccess, upload.single("groupImage"), (req, res, next) =>
    groupController.createGroup(req, res, next)
  )
  .get(...userAccess, (req, res, next) =>
    groupController.getGroups(req, res, next)
  );

router.get("/available", ...userAccess, (req, res, next) =>
  groupController.getAvailableGroups(req, res, next)
);

router.post("/:groupId/join", ...userAccess, (req, res, next) =>
  groupController.joinGroup(req, res, next)
);

// router.get("/:groupId", ...userAccess, (req, res, next) =>
//   groupController.getGroupById(req, res, next)
// );

// group members routes

router.get("/:groupId/members", ...userAccess, (req, res, next) =>
  groupController.getGroupMembers(req, res, next)
);

router.patch(
  "/:groupId/members/:memberId/status",
  ...adminAccess,
  (req, res, next) => groupController.updateGroupMemberStatus(req, res, next)
);

router.get("/chats/user/:userId", ...userAccess, (req, res, next) =>
  groupController.getUserChats(req, res, next)
);

// ------------------   Messages   -------
router
  .route("/chats/:chatId/messages")
  .get(...userAccess, (req, res, next) =>
    groupController.getChatMessages(req, res, next)
  )
  .post(...userAccess, (req, res, next) =>
    groupController.sendChatMessage(req, res, next)
  );

export default router;
