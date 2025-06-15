import { Types } from 'mongoose';
import MessageModel, { IMessageModel } from '../../../models/group.model/group-messages.models';

export class MessageRepository {


  async findLastGroupMessage(groupId: Types.ObjectId): Promise<IMessageModel | null> {
    return MessageModel.findOne({ groupId, messageScope: 'group', isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }


  async countUnreadGroupMessages(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<number> {
    return MessageModel.countDocuments({
      groupId: groupId,
      messageScope: 'group',
      isDeleted: false,
      readBy: { $ne: userId } 
    }).exec();
  }


  async findLastPrivateMessageBetweenUsers(user1Id: Types.ObjectId, user2Id: Types.ObjectId): Promise<IMessageModel | null> {
    return MessageModel.findOne({
      messageScope: 'private',
      isDeleted: false,
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ]
    })
      .sort({ createdAt: -1 })
      .exec();
  }


  async countUnreadPrivateMessagesFromSender(receiverId: Types.ObjectId, senderId: Types.ObjectId): Promise<number> {
    return MessageModel.countDocuments({
      messageScope: 'private',
      isDeleted: false,
      senderId: senderId,
      receiverId: receiverId,
      readBy: { $ne: receiverId } 
    }).exec();
  }

  async markMessagesAsRead(messageIds: Types.ObjectId[], userId: Types.ObjectId): Promise<void> {
    await MessageModel.updateMany(
      { _id: { $in: messageIds }, readBy: { $ne: userId } }, 
      { $addToSet: { readBy: userId }, status: 'read' } 
    ).exec();
  }


  //================================================

   async getMessages(
    chatType: 'group' | 'private',
    targetId: Types.ObjectId, // GroupId or other userId
    actorId: Types.ObjectId,
    page: number,
    limit: number
  ): Promise<{ messages: IMessageModel[]; totalMessages: number }> {
    const skip = (page - 1) * limit;
    let query: any = { isDeleted: false };

    if (chatType === 'group') {
      query.groupId = targetId;
      query.messageScope = 'group';
    } else { // private chat
      query.messageScope = 'private';
      query.$or = [
        { senderId: actorId, receiverId: targetId },
        { senderId: targetId, receiverId: actorId },
      ];
    }

    const messagesPromise = MessageModel.find(query)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'username profilePicture') 
      .exec();

    const totalMessagesPromise = MessageModel.countDocuments(query).exec();

    const [messages, totalMessages] = await Promise.all([messagesPromise, totalMessagesPromise]);

    return { messages, totalMessages };
  }


  async createMessage(messageData: {
    senderId: Types.ObjectId;
    groupId?: Types.ObjectId;
    receiverId?: Types.ObjectId;
    content: string;
    type: "text" | "image" | "video" | "file" | "system";
    messageScope: "private" | "group";
  }): Promise<IMessageModel> {
    const newMessage = new MessageModel({
      ...messageData,
      readBy: [messageData.senderId], // Sender automatically reads their own message
      status: 'sent', // Default to 'sent'
    });
    await newMessage.save();
    return newMessage;
  }


  async markChatMessagesAsRead(
    chatType: 'group' | 'private',
    targetId: Types.ObjectId,
    readerId: Types.ObjectId
  ): Promise<void> {
    let query: any = { isDeleted: false, readBy: { $ne: readerId } }; // Not deleted and not already read by this user

    if (chatType === 'group') {
      query.groupId = targetId;
      query.messageScope = 'group';
      // For group messages, mark all messages as read for the readerId
    } else { // private chat
      query.messageScope = 'private';
      // For private messages, mark messages *sent by the other user* and *received by the reader* as read
      query.senderId = targetId; // The other user in the private chat
      query.receiverId = readerId; // The user currently reading
    }

    await MessageModel.updateMany(
      query,
      { $addToSet: { readBy: readerId }, status: 'read' } // Add readerId to readBy, set status to 'read'
    ).exec();
  }
}