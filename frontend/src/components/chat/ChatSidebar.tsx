import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  User,
  Plus,
  Search,
  MessageCircle,
  Dumbbell,
} from "lucide-react";
import { ChatItem } from "../../pages/chat/ChatPage";
import { formatTimeAgo } from "../../utils/dateFormat";

interface ChatSidebarProps {
  chats: ChatItem[];
  selectedChat: ChatItem | null;
  onSelectChat: (chat: ChatItem) => void;
  onShowAvailableGroups: () => void;
  isLoading: boolean;
  userRole?: "user" | "trainer" | "admin";
}

export const ChatSidebar = ({
  chats = [],
  selectedChat,
  onSelectChat,
  onShowAvailableGroups,
  isLoading,
  userRole,
}: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"groups" | "private">("groups");

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "groups" ? chat.type === "group" : chat.type === "private";
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <div className="flex items-center ">
            <h3 className="text-lg font-semibold text-gray-900 mr-2 hidden lg:block">
              Find Groups
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowAvailableGroups}
              className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Plus size={18} />
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-300"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === "groups"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users size={16} />
            Groups
          </button>
          <button
            onClick={() => setActiveTab("private")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === "private"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Dumbbell size={16} />
            {userRole === "trainer" ? "Trainees" : "Trainers"}
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center">
            <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? "No conversations found" : `No ${activeTab} yet`}
            </p>
            {activeTab === "groups" && (
              <button
                onClick={onShowAvailableGroups}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium hover:cursor-pointer"
              >
                Browse available groups
              </button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedChat?.id === chat.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {chat.avatar ? (
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        {chat.type === "group" ? (
                          <Users className="text-white" size={20} />
                        ) : (
                          <User className="text-white" size={20} />
                        )}
                      </div>
                    )}

                    {chat.type !== "group" && chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {chat.name}
                        </h3>
                      </div>
                      {chat.lastMessageTime && (
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(chat.lastMessageTime)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                      <div className="flex items-center gap-2">
                        {/* {chat.type === "group" && chat.groupMemberCount && (
                          <span className="text-xs text-gray-500">
                            {chat.groupMemberCount}
                          </span>
                        )} */}
                        {chat.unreadCount && chat.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
