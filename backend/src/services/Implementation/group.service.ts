import { inject, injectable } from "tsyringe";
import { GroupRepository } from "../../repositories/Implementation/community/group.repository";
import { GroupMemberRepository } from "../../repositories/Implementation/community/group-member.repository";
import { IGroup, IGroupModel } from "../../models/group.model/group.models";
import { Types } from "mongoose";
import { uploadToCloudinary } from "../../utils/cloud-storage";
import { IGroupMemberModel } from "../../models/group.model/group-member.models";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode, HttpResMsg } from "../../constants/http-response.constants";
import { MessageRepository } from "../../repositories/Implementation/community/message.repository";
import { UserRepository } from "../../repositories/Implementation/user.repository";
import { SubscriptionRepository } from "../../repositories/Implementation/subscription.repository";
import { IMessage } from "../../models/group.model/group-messages.models";
import { TrainerRepository } from "../../repositories/Implementation/trainer.repository";

interface GroupDataForFrontend {
  _id: string;
  name: string;
  description: string;
  adminId: string;
  groupImage?: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

interface GroupListResponse {
  groups: GroupDataForFrontend[];
  totalGroups: number;
  currentPage: number;
  totalPages: number;
}

export interface GroupMember {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    role?: "user" | "trainer" | "admin";
  };
  status: "active" | "left" | "kicked" | "blocked";
  joinedAt: string;
  blockedAt?: string;
  kickedAt?: string;
  leaveAt?: string;
}

export interface GetGroupMembersResponse {
  members: GroupMember[];
  totalMembers: number;
  currentPage: number;
  totalPages: number;
}

export interface AvailableGroupServiceResponse extends GroupDataForFrontend {
  isJoined: boolean;
}

export interface GetAvailableGroupsServiceResponse {
  groups: AvailableGroupServiceResponse[];
  totalGroups: number;
  currentPage: number;
  totalPages: number;
}

export interface ChatItem {
  id: string; 
  type: "group" | "private"; 
  name: string; 
  avatar?: string; 
  lastMessage: string;
  lastMessageTime: string | Date;
  unreadCount: number;
  groupMemberCount?: number; 
}


export interface MessageForFrontend {
  _id: string;
  senderId: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  content: string;
  type: "text" | "image" | "video" | "file" | "system";
  createdAt: string;
  isOwn?: boolean;
}

export interface GetMessagesServiceResponse {
  messages: MessageForFrontend[];
  totalMessages: number;
  currentPage: number;
  totalPages: number;
}

@injectable()
export class GroupService {
  constructor(
    @inject("GroupRepository")
    private groupRepository: GroupRepository,
    @inject("GroupMemberRepository")
    private groupMemberRepository: GroupMemberRepository,
    @inject("MessageRepository")
    private messageRepository: MessageRepository,
    @inject("UserRepository")
    private userRepository: UserRepository,
    @inject("SubscriptionRepository")
    private subscriptionRepository: SubscriptionRepository,
    @inject("TrainerRepository")
    private trainerRepository: TrainerRepository
  ) {}

  async createGroup(
    groupData: { name: string; description: string },
    adminId: string,
    groupImageFile?: Express.Multer.File
  ): Promise<IGroupModel> {
    let groupImageUrl: string | undefined;

    if (groupImageFile) {
      const cloudinaryResult = await uploadToCloudinary(
        groupImageFile,
        "group-pictures"
      );
      groupImageUrl = cloudinaryResult.Location;
    }

    const newGroup: Partial<IGroup> = {
      name: groupData.name,
      description: groupData.description,
      adminId: new Types.ObjectId(adminId),
      ...(groupImageUrl && { groupImage: groupImageUrl }),
    };

    const createdGroup = await this.groupRepository.create(newGroup);

    await this.groupMemberRepository.createMember(
      createdGroup._id,
      new Types.ObjectId(adminId)
    );
    return createdGroup;
  }

  async getGroups(
    page: number,
    limit: number,
    searchTerm?: string
  ): Promise<GroupListResponse> {
    const { groups: rawGroups, totalGroups } =
      await this.groupRepository.findAndPaginate(page, limit, searchTerm);

    const groupsWithMemberCount: GroupDataForFrontend[] = await Promise.all(
      rawGroups.map(async (group) => {
        const memberCount =
          await this.groupMemberRepository.countActiveMembersInGroup(group._id);
        return {
          _id: group._id.toString(),
          name: group.name,
          description: group.description,
          adminId: group.adminId.toString(),
          groupImage: group.groupImage,
          memberCount: memberCount,
          createdAt: group.createdAt.toISOString(),
          updatedAt: group.updatedAt.toISOString(),
        };
      })
    );

    const totalPages = Math.ceil(totalGroups / limit);

    return {
      groups: groupsWithMemberCount,
      totalGroups: totalGroups,
      currentPage: page,
      totalPages: totalPages,
    };
  }

  async getGroupById(groupId: string): Promise<GroupDataForFrontend | null> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      return null;
    }
    const memberCount =
      await this.groupMemberRepository.countActiveMembersInGroup(group._id);
    return {
      _id: group._id.toString(),
      name: group.name,
      description: group.description,
      adminId: group.adminId.toString(),
      groupImage: group.groupImage,
      memberCount: memberCount,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    };
  }

  async getGroupMemberById(
    groupId: string,
    memberId: string
  ): Promise<IGroupMemberModel | null> {
    const member = await this.groupMemberRepository.findOne({
      groupId: new Types.ObjectId(groupId),
      userId: new Types.ObjectId(memberId),
    });

    return member;
  }

  async getGroupMembers(
    groupId: string,
    page: number,
    limit: number,
    searchTerm?: string,
    status?: string
  ): Promise<GetGroupMembersResponse> {
    const { members: rawMembers, totalMembers } =
      await this.groupMemberRepository.findAndPaginateMembers(
        new Types.ObjectId(groupId),
        page,
        limit,
        searchTerm,
        status
      );

    const membersForFrontend: GroupMember[] = rawMembers.map((member) => ({
      _id: member._id.toString(),
      userId: {
        _id: (member.userId as Types.ObjectId).toString(),
        username: (member.userId as any).username,
        email: (member.userId as any).email,
        profilePicture: (member.userId as any).profilePicture,
        role: (member.userId as any).role,
      },
      status: member.status,
      joinedAt: member.joinedAt.toISOString(),
      ...(member.blockedAt && { blockedAt: member.blockedAt.toISOString() }),
      ...(member.kickedAt && { kickedAt: member.kickedAt.toISOString() }),
      ...(member.leaveAt && { leaveAt: member.leaveAt.toISOString() }),
    }));

    const totalPages = Math.ceil(totalMembers / limit);

    return {
      members: membersForFrontend,
      totalMembers: totalMembers,
      currentPage: page,
      totalPages: totalPages,
    };
  }

  async updateGroupMemberStatus(
    groupId: string,
    userId: string,
    newStatus: "active" | "left" | "kicked" | "blocked",
    actorId: string,
    actorRole: string
  ): Promise<GroupMember | null> {
    const groupMemberToUpdate = await this.groupMemberRepository.findOne({
      groupId: new Types.ObjectId(groupId),
      _id: new Types.ObjectId(userId),
    });
    if (!groupMemberToUpdate) {
      throw new CustomError("Group member not found.", HttpResCode.NOT_FOUND);
    }

    const currentMemberStatus = groupMemberToUpdate.status;

    if (newStatus === "kicked" || newStatus === "blocked") {
      if (actorRole !== "admin") {
        throw new CustomError(
          "Forbidden: Only administrators can kick or block members.",
          HttpResCode.FORBIDDEN
        );
      }
    } else if (newStatus === "left") {
      if (actorId !== groupMemberToUpdate.userId.toString()) {
        throw new CustomError(
          "Forbidden: You can only leave your own group membership.",
          HttpResCode.FORBIDDEN
        );
      }
    } else if (newStatus === "active") {
      if (currentMemberStatus === "left") {
        if (actorId !== groupMemberToUpdate.userId.toString()) {
          throw new CustomError(
            "Forbidden: You can only rejoin your own group membership.",
            HttpResCode.FORBIDDEN
          );
        }
      } else if (
        currentMemberStatus === "kicked" ||
        currentMemberStatus === "blocked"
      ) {
        if (actorRole !== "admin") {
          throw new CustomError(
            "Forbidden: Only administrators can activate a kicked or blocked membership.",
            HttpResCode.FORBIDDEN
          );
        }
      } else {
        if (currentMemberStatus === "active") {
          throw new CustomError("Member is already active.", HttpResCode.OK);
        }
        throw new CustomError(
          "Cannot activate from current status without admin privileges.",
          HttpResCode.BAD_REQUEST
        );
      }
    }

    const updatedMember = await this.groupMemberRepository.updateMemberStatus(
      new Types.ObjectId(groupId),
      new Types.ObjectId(userId),
      newStatus
    );

    if (!updatedMember) return null;

    const populatedMember = await this.groupMemberRepository.findMember(
      new Types.ObjectId(groupId),
      updatedMember._id
    );

    if (
      !populatedMember ||
      !populatedMember.userId ||
      typeof populatedMember.userId === "string"
    ) {
      throw new Error(
        "Failed to retrieve populated member details after update."
      );
    }

    return {
      _id: populatedMember._id.toString(),
      userId: {
        _id: (populatedMember.userId as Types.ObjectId).toString(),
        username: (populatedMember.userId as any).username,
        email: (populatedMember.userId as any).email,
        profilePicture: (populatedMember.userId as any).profilePicture,
        role: (populatedMember.userId as any).role,
      },
      status: populatedMember.status,
      joinedAt: populatedMember.joinedAt.toISOString(),
      ...(populatedMember.blockedAt && {
        blockedAt: populatedMember.blockedAt.toISOString(),
      }),
      ...(populatedMember.kickedAt && {
        kickedAt: populatedMember.kickedAt.toISOString(),
      }),
      ...(populatedMember.leaveAt && {
        leaveAt: populatedMember.leaveAt.toISOString(),
      }),
    };
  }

  async getAvailableGroups(
    actorId: string,
    page: number,
    limit: number,
    searchTerm?: string
  ): Promise<GetAvailableGroupsServiceResponse> {
    const { groups: rawGroups, totalGroups } =
      await this.groupRepository.findAndPaginate(page, limit, searchTerm);

    const groupIds = rawGroups.map((group) => group._id);

    const membershipMap =
      await this.groupMemberRepository.checkMembershipStatusForUserInGroups(
        new Types.ObjectId(actorId),
        groupIds
      );

    const availableGroups: AvailableGroupServiceResponse[] = await Promise.all(
      rawGroups.map(async (group) => {
        const memberCount =
          await this.groupMemberRepository.countActiveMembersInGroup(group._id);
        const isJoined = membershipMap.get(group._id.toString()) || false;

        return {
          _id: group._id.toString(),
          name: group.name,
          description: group.description,
          adminId: group.adminId.toString(),
          groupImage: group.groupImage,
          memberCount: memberCount,
          createdAt: group.createdAt.toISOString(),
          updatedAt: group.updatedAt.toISOString(),
          isJoined: isJoined,
        };
      })
    );

    const totalPages = Math.ceil(totalGroups / limit);

    return {
      groups: availableGroups,
      totalGroups: totalGroups,
      currentPage: page,
      totalPages: totalPages,
    };
  }

  async joinGroup(groupId: string, userId: string): Promise<GroupMember> {
    if (!Types.ObjectId.isValid(groupId)) {
      throw new CustomError("Invalid Group ID.", HttpResCode.BAD_REQUEST);
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError(
        "Invalid User ID (actorId).",
        HttpResCode.UNAUTHORIZED
      );
    }

    const groupObjectId = new Types.ObjectId(groupId);
    const userObjectId = new Types.ObjectId(userId);

    const group = await this.groupRepository.findById(groupObjectId);
    if (!group) {
      throw new CustomError("Group not found.", HttpResCode.NOT_FOUND);
    }

    const existingMembership = await this.groupMemberRepository.findMember(
      groupObjectId,
      userObjectId
    );

    if (existingMembership && existingMembership.status === "active") {
      throw new CustomError(
        "You are already an active member of this group.",
        HttpResCode.BAD_REQUEST
      );
    }

    if (
      existingMembership &&
      (existingMembership.status === "kicked" ||
        existingMembership.status === "blocked")
    ) {
      throw new CustomError(
        "You have been prevented from joining this group. Please contact an administrator.",
        HttpResCode.FORBIDDEN
      );
    }

    const member = await this.groupMemberRepository.joinGroup(
      groupObjectId,
      userObjectId
    );

    const populatedMember = await this.groupMemberRepository.findMember(
      groupObjectId,
      member.userId
    );

    if (!populatedMember || typeof populatedMember.userId === "string") {
      throw new CustomError(
        "Failed to retrieve populated member details after join.",
        500
      );
    }

    return populatedMember;
  }

  async getUserChats(
    userId: string,
    userRole: "user" | "trainer" | "admin"
  ): Promise<ChatItem[]> {
    const userObjectId = new Types.ObjectId(userId);
    let allChatItems: ChatItem[] = [];

    const activeGroupMemberships =
      await this.groupMemberRepository.findActiveGroupMembersForUser(
        userObjectId
      );

    const groupChatItems = await Promise.all(
      activeGroupMemberships.map(async (membership) => {
        const groupId = membership.groupId as Types.ObjectId;
        const group = await this.groupRepository.findById(groupId);

        if (!group) {
          console.warn(
            `User ${userId} has a membership to a non-existent group. Skipping.`
          );
          return null;
        }

        const lastMessageDoc =
          await this.messageRepository.findLastGroupMessage(group._id);
        const lastMessageContent = lastMessageDoc
          ? lastMessageDoc.content
          : "No messages yet.";
        const lastMessageTime = lastMessageDoc
          ? lastMessageDoc.createdAt
          : group.createdAt;

        const unreadCount =
          await this.messageRepository.countUnreadGroupMessages(
            group._id,
            userObjectId
          );
        const groupMemberCount =
          await this.groupMemberRepository.countActiveMembersInGroup(group._id);

        return {
          id: group._id.toString(),
          type: "group",
          name: group.name,
          avatar: group.groupImage,
          lastMessage: lastMessageContent,
          lastMessageTime: lastMessageTime,
          unreadCount: unreadCount,
          groupMemberCount: groupMemberCount,
        } as ChatItem;
      })
    );

    allChatItems = allChatItems.concat(
      groupChatItems.filter((item) => item !== null) as ChatItem[]
    );


    let privateChatPartners: Types.ObjectId[] = [];

    if (userRole === "user") {
      privateChatPartners =
        await this.subscriptionRepository.findActiveSubscribedTrainers(
          userObjectId
        );
    } else if (userRole === "trainer") {
      const trainer = await this.trainerRepository.findOne({ userId });
      if (!trainer) {
        throw new CustomError(
          HttpResMsg.TRAINER_NOT_FOUND,
          HttpResCode.NOT_FOUND
        );
      }
      const trainerId = trainer.id;
      privateChatPartners =
        await this.subscriptionRepository.findActiveSubscribedTrainees(
          trainerId
        );
    }


    const privateChatItems = await Promise.all(
      privateChatPartners.map(async (partnerObjectId) => {
        const partnerUser = await this.userRepository.findById(partnerObjectId);

        if (!partnerUser) {
          console.warn(
            `Private chat partner ${partnerObjectId} not found for user ${userId}. Skipping.`
          );
          return null;
        }

        const lastMessageDoc =
          await this.messageRepository.findLastPrivateMessageBetweenUsers(
            userObjectId,
            partnerObjectId
          );
        const lastMessageContent = lastMessageDoc
          ? lastMessageDoc.content
          : "No messages yet.";
        const lastMessageTime = lastMessageDoc
          ? lastMessageDoc.createdAt.toISOString()
          : partnerUser.createdAt.toISOString();

        const unreadCount =
          await this.messageRepository.countUnreadPrivateMessagesFromSender(
            userObjectId,
            partnerObjectId
          );

        return {
          id: partnerUser.id.toString(),
          type: "private",
          name: partnerUser.username, 
          avatar: partnerUser.profilePicture, 
          lastMessage: lastMessageContent,
          lastMessageTime: lastMessageTime,
          unreadCount: unreadCount,
        } as ChatItem;
      })
    );

    allChatItems = allChatItems.concat(
      privateChatItems.filter((item) => item !== null) as ChatItem[]
    );

    allChatItems.sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
    );

    return allChatItems;
  }


  async getChatMessages(
    chatId: string,
    chatType: "group" | "private",
    actorId: string,
    page: number,
    limit: number
  ): Promise<GetMessagesServiceResponse> {
    if (!Types.ObjectId.isValid(chatId) || !Types.ObjectId.isValid(actorId)) {
      throw new CustomError("Invalid chat ID or user ID.", 400);
    }

    const chatObjectId = new Types.ObjectId(chatId);
    const actorObjectId = new Types.ObjectId(actorId);

    if (chatType === "group") {
      const isMember = await this.groupMemberRepository.findMember(
        chatObjectId,
        actorObjectId
      );
      if (!isMember || isMember.status !== "active") {
        throw new CustomError(
          "You are not an active member of this group.",
          HttpResCode.FORBIDDEN
        );
      }
    } else {
      const targetUser = await this.userRepository.findById(
        new Types.ObjectId(chatId)
      );
      if (!targetUser) {
        throw new CustomError("Private chat partner not found.", 404);
      }
    }

    const { messages: rawMessages, totalMessages } =
      await this.messageRepository.getMessages(
        chatType,
        chatObjectId,
        actorObjectId,
        page,
        limit
      );

    const unreadMessagesForActor = rawMessages.filter(
      (msg) =>
        !msg.readBy.includes(actorObjectId) &&
        msg.senderId.toString() !== actorId
    );
    if (unreadMessagesForActor.length > 0) {
      await this.messageRepository.markMessagesAsRead(
        unreadMessagesForActor.map((msg) => msg._id),
        actorObjectId
      );
      //  update unread counts in your frontend via websockets here
    }

    const messagesForFrontend: MessageForFrontend[] = rawMessages.map(
      (msg) => ({
        _id: msg._id.toString(),
        senderId: {
          _id: (msg.senderId as any)._id.toString(),
          username: (msg.senderId as any).username,
          profilePicture: (msg.senderId as any).profilePicture,
        },
        content: msg.content,
        type: msg.type,
        createdAt: msg.createdAt.toISOString(),
        isOwn: (msg.senderId as any)._id.toString() === actorId,
      })
    );

    const totalPages = Math.ceil(totalMessages / limit);

    return {
      messages: messagesForFrontend,
      totalMessages: totalMessages,
      currentPage: page,
      totalPages: totalPages,
    };
  }

  async sendChatMessage(
    senderId: string,
    chatType: "group" | "private",
    targetId: string, 
    content: string,
    type: "text" | "image" | "video" | "file" | "system" 
  ): Promise<MessageForFrontend> {

    if (
      !Types.ObjectId.isValid(senderId) ||
      !Types.ObjectId.isValid(targetId)
    ) {
      throw new CustomError("Invalid sender ID or target ID.", 400);
    }

    if (!content || content.trim() === "") {
      throw new CustomError("Message content cannot be empty.", 400);
    }

    const allowedMessageTypes: Array<typeof type> = [
      "text",
      "image",
      "video",
      "file",
      "system",
    ];
    if (!allowedMessageTypes.includes(type)) {
      throw new CustomError("Invalid message type.", 400);
    }

    const senderObjectId = new Types.ObjectId(senderId);
    const targetObjectId = new Types.ObjectId(targetId);

    let messagePayload: Partial<IMessage> = {
      senderId: senderObjectId,
      content,
      type,
      messageScope: chatType,
    };

    if (chatType === "group") {
      const isMember = await this.groupMemberRepository.findMember(
        targetObjectId,
        senderObjectId
      );
      if (!isMember || isMember.status !== "active") {
        throw new CustomError(
          "You are not an active member of this group and cannot send messages.",
          403
        );
      }
      messagePayload.groupId = targetObjectId;
    } else {
      const receiverUser = await this.userRepository.findById(
        new Types.ObjectId(targetId)
      ); 
      if (!receiverUser) {
        throw new CustomError("Receiver not found for private chat.", 404);
      }
      messagePayload.receiverId = targetObjectId;
    }

    const createdMessage = await this.messageRepository.createMessage(
      messagePayload as any
    ); 

    const populatedMessage = await this.messageRepository.getMessages(
      chatType,
      targetObjectId, 
      senderObjectId, 
      1, 
      1
    );

    if (
      !populatedMessage.messages ||
      populatedMessage.messages.length === 0 ||
      typeof populatedMessage.messages[0].senderId === "string"
    ) {
      throw new Error("Failed to retrieve populated sent message details.");
    }

    const sentMessageForFrontend: MessageForFrontend = {
      _id: createdMessage._id.toString(),
      senderId: {
        _id: (populatedMessage.messages[0].senderId as any)._id.toString(),
        username: (populatedMessage.messages[0].senderId as any).username,
        profilePicture: (populatedMessage.messages[0].senderId as any)
          .profilePicture,
      },
      content: createdMessage.content,
      type: createdMessage.type,
      createdAt: createdMessage.createdAt.toISOString(),
    };

    //  WebSocket
    // `io.to(chatId).emit('newMessage', sentMessageForFrontend);`
    // or `io.to(senderId).to(targetId).emit('privateMessage', sentMessageForFrontend);`

    return sentMessageForFrontend;
  }
}
