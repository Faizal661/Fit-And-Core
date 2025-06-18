import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Calendar,
  Shield,
  UserX,
  Ban,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  getGroupMembers,
  GroupMember,
  updateGroupMemberStatus,
} from "../../../services/community/groupMemberService";
import useDebounce from "../../../hooks/useDebounce";

interface GroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

export const GroupMembersModal = ({
  isOpen,
  onClose,
  groupId,
}: GroupMembersModalProps) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const limit = 10;

  // Fetch group members
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "groupMembers",
      groupId,
      currentPage,
      debouncedSearchTerm,
      selectedStatus,
      limit,
    ],
    queryFn: () =>
      getGroupMembers(groupId, {
        page: currentPage,
        limit: limit,
        search: debouncedSearchTerm,
        status: selectedStatus,
      }),
    enabled: isOpen && !!groupId,
  });

  // Update member status mutation
  const updateMemberStatusMutation = useMutation({
    mutationFn: ({
      memberId,
      status,
    }: {
      memberId: string;
      status: "active" | "left" | "kicked" | "blocked";
    }) => {
      return updateGroupMemberStatus(groupId, memberId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      console.error("Failed to update member status:", error);
    },
  });

  const handleStatusChange = (memberId: string, status: string) => {
    updateMemberStatusMutation.mutate({
      memberId,
      status: status as "active" | "left" | "kicked" | "blocked",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "left":
        return "bg-gray-100 text-gray-700";
      case "kicked":
        return "bg-red-100 text-red-700";
      case "blocked":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Shield size={14} />;
      case "left":
        return <User size={14} />;
      case "kicked":
        return <UserX size={14} />;
      case "blocked":
        return <Ban size={14} />;
      default:
        return <User size={14} />;
    }
  };

  const displayMembers = data?.members;
  const totalPages = Math.ceil((data?.totalMembers || 0) / limit);

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
                    <User className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Group Members
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search members..."
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="left">Left</option>
                  <option value="kicked">Kicked</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading members...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-xl">
                  <AlertTriangle
                    size={48}
                    className="text-red-500 mx-auto mb-4"
                  />
                  <p className="text-red-600">Failed to load members</p>
                </div>
              ) : displayMembers?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <User size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No members found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayMembers?.map((member: GroupMember) => (
                    <motion.div
                      key={member._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {member.userId.profilePicture ? (
                            <img
                              src={member.userId.profilePicture}
                              alt={member.userId.username}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="text-white" size={20} />
                            </div>
                          )}

                          <div>
                            <h3 className="font-medium text-gray-900">
                              {member.userId.username}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {member.userId.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar size={12} className="text-gray-400" />
                              <span className="text-xs text-gray-500">
                                Joined:{" "}
                                {new Date(member.joinedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                              member.status
                            )}`}
                          >
                            {getStatusIcon(member.status)}
                            {member.status.charAt(0).toUpperCase() +
                              member.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {member.status === "active" && (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleStatusChange(member._id, "kicked")
                                }
                                disabled={updateMemberStatusMutation.isPending}
                                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm flex items-center gap-1"
                              >
                                <UserX size={14} />
                                Kick
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleStatusChange(member._id, "blocked")
                                }
                                disabled={updateMemberStatusMutation.isPending}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center gap-1"
                              >
                                <Ban size={14} />
                                Block
                              </motion.button>
                            </div>
                          )}

                          {(member.status === "kicked" ||
                            member.status === "blocked") && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleStatusChange(member._id, "active")
                              }
                              disabled={updateMemberStatusMutation.isPending}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm flex items-center gap-1"
                            >
                              <Shield size={14} />
                              Restore
                            </motion.button>
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
