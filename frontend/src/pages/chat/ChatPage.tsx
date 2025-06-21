import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import { MessageCircle } from "lucide-react";
import { ChatSidebar } from "../../components/chat/ChatSidebar";
import { ChatWindow } from "../../components/chat/ChatWindow";
import {
  AvailableGroupsModal,
  Group,
} from "../../components/chat/AvailableGroupsModal";
import ConfirmModal from "../../components/shared/modal/ConfirmModal";
import { RootState } from "../../redux/store";
import { joinGroup } from "../../services/community/groupService";
import { useToast } from "../../context/ToastContext";
import axios from "axios";
import {
  getMessagesofSelectedChat,
  getUserChats,
  sendMessage,
} from "../../services/chats/chatService";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export interface ChatItem {
  id: string;
  type: "group" | "private";
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageType?: "text" | "image" | "system";
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
  groupMemberCount?: number;
}

export interface Message {
  _id: string;
  content: string;
  type: "text" | "image" | "system";
  senderId: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string; 
  isOwn: boolean;
}

const ChatPage = () => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [isAvailableGroupsModalOpen, setIsAvailableGroupsModalOpen] =
    useState(false);
  const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false);
  const [selectedGroupToJoin, setSelectedGroupToJoin] = useState<Group | null>(
    null
  );

  // Fetch user's chats (groups + private)
  const { data: chats, isLoading: chatsLoading } = useQuery({
    queryKey: ["userChats", userId],
    queryFn: () => getUserChats(userId!),
  });

  // Fetch messages for selected chat
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["chatMessages", selectedChat?.id],
    queryFn: () =>
      getMessagesofSelectedChat(
        selectedChat?.id || "",
        selectedChat?.type || ""
      ),
    enabled: !!selectedChat,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      chatId,
      chatType,
      content,
      type,
      file
    }: {
      chatId: string;
      chatType: string;
      content: string;
      type: string;
      file?:File
    }) =>
      sendMessage({
        chatId,
        chatType,
        content,
        type,
        file
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", selectedChat?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      showToast("success", "Message sent successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data.message || "Error while sending message"
        );
      } else {
        showToast("error", "Error while sending message");
      }
    },
  });

  // Join group mutation
  const joinGroupMutation = useMutation({
    mutationFn: (groupId: string) => joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availableGroups"] });
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      setIsJoinGroupModalOpen(false);
      setSelectedGroupToJoin(null);
      showToast("success", "Successfully joined group.");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data.message || "Error while joining group"
        );
      } else {
        showToast("error", "Error while joining group");
      }
    },
  });

  const handleSendMessage = (content: string, type: string = "text", file?: File ) => {
    if (!selectedChat || (!content.trim() && !file)) return;

    sendMessageMutation.mutate({
      chatId: selectedChat.id,
      chatType: selectedChat.type,
      content: content.trim(),
      type,
      file
    });
  };

  const handleJoinGroup = (group: Group) => {
    setSelectedGroupToJoin(group);
    setIsJoinGroupModalOpen(true);
  };

  const confirmJoinGroup = () => {
    if (selectedGroupToJoin) {
      joinGroupMutation.mutate(selectedGroupToJoin._id);
    }
  };

  const displayChats = chats;
  const displayMessages = messagesData?.messages || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-r from-blue-600/90 to-purple-600/90">
        <div
          className="absolute inset-0 bg-black/10 z-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div
            variants={fadeIn}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <MessageCircle size={28} className="text-white" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Messages
            </h1>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="w-16 h-1 bg-white/30 mx-auto mb-4 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Connect with your community and trainers
          </motion.p>
        </motion.div>
      </div>

      {/* Main Chat Interface */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
          style={{ height: "calc(100vh - 200px)" }}
        >
          <div className="flex h-full">
            {/* Sidebar - 25% width */}
            <div
              className={`${
                selectedChat ? "hidden lg:block lg:w-2/6" : ""
              }  border-r border-gray-200 flex flex-col`}
            >
              <ChatSidebar
                chats={displayChats}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
                onShowAvailableGroups={() =>
                  setIsAvailableGroupsModalOpen(true)
                }
                isLoading={chatsLoading}
                userRole={userRole}
              />
            </div>

            {/* Chat Window - 75% width */}
            <div
              className={`  ${
                !selectedChat ? "hidden sm:flex sm:w-full" : "w-full"
              }  lg:w-4/6 flex flex-col`}
            >
              {!selectedChat ? (
                <div className="hidden sm:flex-1 sm:flex  items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageCircle
                      size={64}
                      className="text-gray-400 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500">
                      Choose a group or trainer to start messaging
                    </p>
                  </div>
                </div>
              ) : (
                <ChatWindow
                  chat={selectedChat}
                  messages={displayMessages}
                  onSendMessage={handleSendMessage}
                  isLoading={messagesLoading}
                  isSending={sendMessageMutation.isPending}
                  onBack={() => setSelectedChat(null)}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Available Groups Modal */}
      <AvailableGroupsModal
        isOpen={isAvailableGroupsModalOpen}
        onClose={() => setIsAvailableGroupsModalOpen(false)}
        onJoinGroup={handleJoinGroup}
      />

      {/* Join Group Confirmation Modal */}
      <ConfirmModal
        type="success"
        title="Join Group"
        message={`Are you sure you want to join "${selectedGroupToJoin?.name}"?`}
        confirmText="Join Group"
        isOpen={isJoinGroupModalOpen}
        onClose={() => {
          setIsJoinGroupModalOpen(false);
          setSelectedGroupToJoin(null);
        }}
        onConfirm={confirmJoinGroup}
        isConfirming={joinGroupMutation.isPending}
      />
    </div>
  );
};

export default ChatPage;
