import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Users,
  Plus,
  Eye,
  // MessageCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { CreateGroupModal } from "../../components/admin/community/CreateGroupModal";
import { GroupMembersModal } from "../../components/admin/community/GroupMembersModal";
// import { GroupChatModal } from "../../components/admin/community/GroupChatModal";
import { Group } from "../../types/community.type";
import { createGroup, getGroups } from "../../services/community/groupService";
import { useToast } from "../../context/ToastContext";
import axios from "axios";
import useDebounce from "../../hooks/useDebounce";

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

const GroupManagementPage = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  // const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 600);
  const { showToast } = useToast();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const limit = 10;

  // get group details
  const { data, isLoading, error } = useQuery({
    queryKey: ["groups", currentPage, debouncedSearchTerm, limit],
    queryFn: () =>
      getGroups({ page: currentPage, limit: limit, search: debouncedSearchTerm }),
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (groupData: FormData) => createGroup(groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsCreateModalOpen(false);
      showToast("success", "Group created successfully!");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data.message || "Failed to create group"
        );
      } else {
        showToast("error", "Failed to create group");
      }
    },
  });

  const handleCreateGroup = (groupData: FormData) => {
    createGroupMutation.mutate(groupData);
  };

  const handleViewMembers = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsMembersModalOpen(true);
  };

  // const handleViewChat = (groupId: string) => {
    // setSelectedGroupId(groupId);
    // setIsChatModalOpen(true);
  // };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((data?.totalGroups || 0) / limit);


  const displayGroups = data?.groups || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-blue-600/90 to-purple-600/90">
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
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div
            variants={fadeIn}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Users size={32} className="text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Group Management
            </h1>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Manage fitness groups, members, and monitor group activities
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          {/* Header with Search and Create Button */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search groups..."
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </form>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus size={18} />
              Create New Group
            </motion.button>
          </div>

          {/* Groups Table */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading groups...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-xl">
              <Users size={48} className="text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Failed to load groups</p>
            </div>
          ) : displayGroups.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Users size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No groups found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Group
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Members
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Created
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayGroups.map((group: Group) => (
                    <motion.tr
                      key={group._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {group.groupImage ? (
                            <img
                              src={group.groupImage}
                              alt={group.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <Users className="text-white" size={20} />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {group.name}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600 text-sm max-w-xs truncate">
                          {group.description}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {group.memberCount} members
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Calendar size={14} />
                          <span>
                            {new Date(group.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewMembers(group._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                          >
                            <Eye size={14} />
                            Members
                          </motion.button>
                          {/* <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewChat(group._id)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            <MessageCircle size={14} />
                            Chat
                          </motion.button> */}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
        </motion.div>
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGroup}
        isSubmitting={createGroupMutation.isPending}
      />

      {selectedGroupId && (
        <>
          <GroupMembersModal
            isOpen={isMembersModalOpen}
            onClose={() => {
              setIsMembersModalOpen(false);
              setSelectedGroupId(null);
            }}
            groupId={selectedGroupId}
          />

          {/* <GroupChatModal
            isOpen={isChatModalOpen}
            onClose={() => {
              setIsChatModalOpen(false);
              setSelectedGroupId(null);
            }}
            groupId={selectedGroupId}
          /> */}
        </>
      )}
    </div>
  );
};

export default GroupManagementPage;
