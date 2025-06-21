import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  User,
  // Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Image as ImageIcon,
  Video,
  File,
  Trash2,
} from "lucide-react";
import { getMessagesofSelectedChat } from "../../../services/chats/chatService";

interface Message {
  _id: string;
  senderId: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  content: string;
  type: "text" | "image" | "video" | "file" | "system";
  replyToMessageId?: string;
  readBy: string[];
  status: "sent" | "delivered" | "read";
  isDeleted: boolean;
  createdAt: string;
}

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

export const GroupChatModal = ({
  isOpen,
  onClose,
  groupId,
}: GroupChatModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchTerm, setSearchTerm] = useState("");

  const limit = 5;

  // Fetch messages for selected chat
  const { data, isLoading ,error} = useQuery({
    queryKey: ["chatMessages", groupId],
    queryFn: () => getMessagesofSelectedChat(groupId, "group"),
  });

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const displayMessages = data?.messages;
  const totalPages = Math.ceil((data?.totalMessages || 0) / limit);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Group Chat Messages
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Search */}
              {/* <div className="mt-4">
                <div className="">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <Search
                    className="abrelativesolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div> */}
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-xl">
                  <AlertTriangle
                    size={48}
                    className="text-red-500 mx-auto mb-4"
                  />
                  <p className="text-red-600">Failed to load messages</p>
                </div>
              ) : displayMessages?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <MessageCircle
                    size={48}
                    className="text-gray-400 mx-auto mb-4"
                  />
                  <p className="text-gray-600">No messages found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayMessages?.map((message: Message) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${
                        message.type === "system"
                          ? "bg-yellow-50 border-yellow-200"
                          : message.isDeleted
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.senderId.profilePicture ? (
                          <img
                            src={message.senderId.profilePicture}
                            alt={message.senderId.username}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            {message.type === "system" ? (
                              <AlertTriangle className="text-white" size={16} />
                            ) : (
                              <User className="text-white" size={16} />
                            )}
                          </div>
                        )}

                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {message.senderId.username}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(message.createdAt)}
                            </span>
                            {message.isDeleted && (
                              <span className="text-xs text-red-500 flex items-center gap-1">
                                <Trash2 size={12} />
                                Deleted
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-gray-700">
                            {message.isDeleted ? (
                              <em className="text-red-500">
                                This message was deleted
                              </em>
                            ) : message.type === "text" ? (
                              <p className="break-words italic text-gray-600">{message.content}</p>
                            ) : message.type === "file" ? (
                              <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                <File size={16} className="text-gray-500" />
                                <span>{message.content}</span>
                              </div>
                            ) : message.type === "image" ? (
                              <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                <ImageIcon
                                  size={16}
                                  className="text-blue-500"
                                />
                                <span>Image: {message.content}</span>
                              </div>
                            ) : message.type === "video" ? (
                              <div className="flex items-center gap-2 p-2 bg-white rounded border">
                                <Video size={16} className="text-purple-500" />
                                <span>Video: {message.content}</span>
                              </div>
                            ) : (
                              <p className="italic text-gray-600">
                                {message.content}
                              </p>
                            )}
                          </div>

                          {message.readBy?.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              Read by {message.readBy?.length} member
                              {message.readBy?.length !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </motion.button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
