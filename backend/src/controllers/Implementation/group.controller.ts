import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { GroupService } from "../../services/Implementation/group.service";
import { sendResponse } from "../../utils/send-response";
import { Types } from "mongoose";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

export class GroupController {
  private groupService: GroupService;

  constructor() {
    this.groupService = container.resolve<GroupService>("GroupService");
  }

  async createGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (req.decoded?.role !== "admin") {
        sendResponse(
          res,
          403,
          "Forbidden: Only administrators can create groups."
        );
        return;
      }

      const { name, description } = req.body;
      const adminId = req.decoded?.id;

      if (!name || !description) {
        sendResponse(res, 400, "Group name and description are required.");
        return;
      }

      const groupImageFile = req.file;

      const createdGroup = await this.groupService.createGroup(
        { name, description },
        adminId,
        groupImageFile
      );

      sendResponse(res, 201, "Group created successfully", createdGroup);
    } catch (error) {
      next(error);
    }
  }

  async getGroups(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.search as string | undefined;

      if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        sendResponse(res, 400, "Invalid pagination parameters.");
        return;
      }

      const groupsData = await this.groupService.getGroups(
        page,
        limit,
        searchTerm
      );
      // Frontend expects { groupResponse: { groups, totalGroups, currentPage, totalPages } }
      sendResponse(res, 200, "Groups retrieved successfully", {
        groupResponse: groupsData,
      });
    } catch (error) {
      console.error("Error getting groups:", error);
      sendResponse(res, 500, "Failed to retrieve groups", error);
    }
  }

  async getGroupById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const groupId = req.params.groupId;
      if (!groupId || !Types.ObjectId.isValid(groupId)) {
        sendResponse(res, 400, "Invalid Group ID provided.1");
        return;
      }
      const group = await this.groupService.getGroupById(groupId);
      if (!group) {
        sendResponse(res, 404, "Group not found.");
        return;
      }
      sendResponse(res, 200, "Group retrieved successfully", group);
    } catch (error) {
      console.error("Error getting group by ID:", error);
      sendResponse(res, 500, "Failed to retrieve group.", error);
    }
  }

  async getGroupMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const groupId = req.params.groupId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.search as string | undefined;
      const status = req.query.status as "active" | "left" | "kicked" | "blocked" | "all" | undefined

      if (!groupId || !Types.ObjectId.isValid(groupId)) {
        sendResponse(res, 400, "Invalid Group ID provided.2");
        return;
      }
      if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        sendResponse(res, 400, "Invalid pagination parameters.");
        return;
      }

      const membersData = await this.groupService.getGroupMembers(
        groupId,
        page,
        limit,
        searchTerm,
        status
      );
      sendResponse(
        res,
        200,
        "Group members retrieved successfully",
        membersData
      );
    } catch (error) {
      console.error("Error getting group members:", error);
      sendResponse(res, 500, "Failed to retrieve group members.", error);
    }
  }

  async updateGroupMemberStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const groupId = req.params.groupId;
      const memberId = req.params.memberId;
      const { status: newStatus } = req.body;
      const actorId = req.decoded?.id;
      const actorRole = req.decoded?.role;

      if (
        !groupId ||
        !Types.ObjectId.isValid(groupId) ||
        !memberId ||
        !Types.ObjectId.isValid(memberId)
      ) {
        sendResponse(res, 400, "Invalid Group ID or Member ID provided.");
        return;
      }

      const allowedStatuses = ["active", "left", "kicked", "blocked"];
      if (!allowedStatuses.includes(newStatus)) {
        sendResponse(res, 400, "Invalid status provided.");
        return;
      }

      const updatedMember = await this.groupService.updateGroupMemberStatus(
        groupId,
        memberId,
        newStatus as "active" | "left" | "kicked" | "blocked",
        actorId!,
        actorRole!
      );

      if (!updatedMember) {
        sendResponse(res, 404, "Group member not found or update failed.");
        return;
      }

      sendResponse(res, 200, "Member status updated successfully", {
        member: updatedMember,
      });
    } catch (error) {
      console.error("Error updating member status:", error);
      sendResponse(res, 500, "Failed to update member status.", error);
    }
  }

  async getAvailableGroups(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const actorId = req.decoded?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const searchTerm = req.query.search as string | undefined;

      if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        throw new CustomError(
          "Invalid pagination parameters.",
          HttpResCode.BAD_REQUEST
        );
      }

      const availableGroupsData = await this.groupService.getAvailableGroups(
        actorId!,
        page,
        limit,
        searchTerm
      );
      sendResponse(res, 200, "Available groups retrieved successfully", {
        availableGroupsData,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        sendResponse(res, error.statusCode, error.message);
      } else {
        console.error("Error getting available groups:", error);
        sendResponse(res, 500, "Failed to retrieve available groups.", error);
      }
    }
  }

  async joinGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const groupId = req.params.groupId;
      const userId = req.decoded?.id;

      if (!groupId || !Types.ObjectId.isValid(groupId)) {
        throw new CustomError(
          "Invalid Group ID provided.",
          HttpResCode.BAD_REQUEST
        );
      }

      const joinedMember = await this.groupService.joinGroup(groupId, userId!);
      sendResponse(res, 200, "Successfully joined group", {
        member: joinedMember,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to join group.",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserChats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userIdFromParam = req.params.userId;
      const userRole = req.decoded?.role;

      if (!Types.ObjectId.isValid(userIdFromParam)) {
        throw new CustomError("Invalid User ID in URL provided.", 400);
      }

      const userChats = await this.groupService.getUserChats(
        userIdFromParam,
        userRole!
      );
      sendResponse(res, 200, "User chats retrieved successfully", {
        userChats,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        sendResponse(res, error.statusCode, error.message);
      } else {
        console.error("Error getting user chats:", error);
        sendResponse(res, 500, "Failed to retrieve user chats.", error);
      }
    }
  }

  async getChatMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const chatId = req.params.chatId;
      const chatType = req.query.type as "group" | "private";
      const actorId = req.decoded?.id;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!chatId || !Types.ObjectId.isValid(chatId)) {
        throw new CustomError(
          "Invalid chat ID provided.",
          HttpResCode.BAD_REQUEST
        );
      }
      if (!chatType || (chatType !== "group" && chatType !== "private")) {
        throw new CustomError(
          'Invalid chat type provided. Must be "group" or "private".',
          HttpResCode.BAD_REQUEST
        );
      }
      if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        throw new CustomError(
          "Invalid pagination parameters.",
          HttpResCode.BAD_REQUEST
        );
      }

      const messagesData = await this.groupService.getChatMessages(
        chatId,
        chatType,
        actorId!,
        page,
        limit
      );

      sendResponse(res, 200, "Messages retrieved successfully", {
        messagesData,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        sendResponse(res, error.statusCode, error.message);
      } else {
        console.error("Error fetching chat messages:", error);
        sendResponse(res, 500, "Failed to retrieve messages.");
      }
    }
  }

  async sendChatMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const chatId = req.params.chatId;
      const senderId = req.decoded?.id;
      
      const { chatType, content, type } = req.body;
      const file = req.file

      if (!chatId || !Types.ObjectId.isValid(chatId)) {
        throw new CustomError(
          "Invalid chat ID provided.",
          HttpResCode.BAD_REQUEST
        );
      }
      if (!chatType || (chatType !== "group" && chatType !== "private")) {
        throw new CustomError(
          'Invalid chat type provided. Must be "group" or "private".',
          HttpResCode.BAD_REQUEST
        );
      }

      const allowedSendTypes = ["text", "image"];
      if (
        !type ||
        typeof type !== "string" ||
        !allowedSendTypes.includes(type)
      ) {
        throw new CustomError(
          'Invalid message type for sending. Must be "text", "image"',
          HttpResCode.BAD_REQUEST
        );
      }

      const createdMessage = await this.groupService.sendChatMessage(
        senderId!,
        chatType,
        chatId,
        content,
        type as "text" | "image" ,
        file,
      );

      sendResponse(res, 201, "Message sent successfully", {
        message: createdMessage,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        next(error)
      } else {
        console.error("Error sending message:", error);
        sendResponse(res, 500, "Failed to send message.");
      }
    }
  }
}
