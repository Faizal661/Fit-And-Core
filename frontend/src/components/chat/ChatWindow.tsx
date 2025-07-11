import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MoreVertical,
  ArrowLeft,
  Users,
  User,
  ImageIcon,
  Info,
} from "lucide-react";
import { ChatItem, Message } from "../../pages/chat/ChatPage";
import { GroupDetailsModal } from "./GroupDetailsModal";
import ImageViewModal from "../modal/ImageViewModal";

interface ChatWindowProps {
  chat: ChatItem;
  messages: Message[];
  onSendMessage: (content: string, type?: string, file?: File) => void;
  isLoading: boolean;
  isSending: boolean;
  onBack?: () => void;
}

export const ChatWindow = ({
  chat,
  messages = [],
  onSendMessage,
  isLoading,
  isSending,
  onBack,
}: ChatWindowProps) => {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage("", "image", file);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date

  const groupedMessages = messages
    .slice()
    .reverse()
    .reduce((groups: { [key: string]: Message[] }, message) => {
      const date = formatMessageDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors "
            >
              <ArrowLeft size={20} />
            </button>

            <div
              className={`flex items-center gap-3 ${
                chat.type === "group" ? "cursor-pointer" : ""
              }`}
              onClick={() =>
                chat.type === "group" && setShowGroupDetailsModal(true)
              }
            >
              <div className="relative">
                {chat.avatar ? (
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setCurrentImageUrl(chat.avatar!)}}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    {chat.type === "group" ? (
                      <Users className="text-white" size={18} />
                    ) : (
                      <User className="text-white" size={18} />
                    )}
                  </div>
                )}

                {chat.type !== "group" && chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">{chat.name}</h3>
                <p className="text-sm text-gray-500">
                  {chat.type === "group"
                    ? `${chat.groupMemberCount} members`
                    : chat.isOnline
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Conditional Button for Group Details Modal */}
            {chat.type === "group" && (
              <button
                onClick={() => setShowGroupDetailsModal(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="View group details"
              >
                <Info size={20} className="text-gray-600" />
              </button>
            )}

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                    {date}
                  </div>
                </div>

                {/* Messages for this date */}
                {dateMessages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.isOwn ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`flex items-end gap-2 max-w-xs lg:max-w-md ${
                        message.isOwn ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {!message.isOwn && (
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          {message.senderId.profilePicture ? (
                            <img
                              src={message.senderId.profilePicture}
                              alt={message.senderId.username}
                              className="w-full h-full object-cover hover:cursor-pointer"
                              onClick={() =>
                                setCurrentImageUrl(
                                  message.senderId.profilePicture!
                                )
                              }
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                              <User className="text-white" size={14} />
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`${
                          message.isOwn
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-900"
                        } rounded-2xl px-4 py-2 shadow-sm`}
                      >
                        {!message.isOwn && chat.type === "group" && (
                          <p className="text-xs font-medium mb-1 opacity-70">
                            {message.senderId.username}
                          </p>
                        )}

                        {message.type === "image" ? (
                          <img
                            src={message.content}
                            alt={message.content}
                            className="max-w-[220px] max-h-[220px] rounded-lg mb-1 object-cover hover:cursor-pointer"
                            style={{ objectFit: "cover" }}
                            onClick={() => setCurrentImageUrl(message.content)}
                          />
                        ) : (
                          <p className="text-sm break-words">
                            {message.content}
                          </p>
                        )}

                        <p
                          className={`text-xs mt-1 ${
                            message.isOwn ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 mb-2 hover:bg-gray-100 bg-gray-200 rounded-full transition-colors"
            >
              {/* <Paperclip size={20} className="text-gray-600" /> */}
              <ImageIcon size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-2xl resize-none transition-all duration-300"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
            {/* <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Smile size={18} className="text-gray-600" />
            </button> */}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending}
            className={`p-2 mb-2 rounded-full transition-all duration-300 ${
              messageInput.trim() && !isSending
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-black border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </motion.button>
        </div>

        <input
          ref={fileInputRef}
          accept="image/*"
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Group Details Modal */}
      {chat.type === "group" && (
        <GroupDetailsModal
          isOpen={showGroupDetailsModal}
          onClose={() => setShowGroupDetailsModal(false)}
          groupId={chat.id}
        />
      )}

      {/* Image View Modal */}
      <ImageViewModal
        imageUrl={currentImageUrl}
        onClose={() => setCurrentImageUrl(null)}
      />
    </div>
  );
};
