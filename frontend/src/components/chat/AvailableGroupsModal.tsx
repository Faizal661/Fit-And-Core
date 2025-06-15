import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Calendar,
  User,
} from "lucide-react";
import { getAvailableGroups } from "../../services/community/groupService";

export interface Group {
  _id: string;
  name: string;
  description: string;
  memberCount: number;
  groupImage?: string;
  createdAt: string;
  isJoined?: boolean;
}

interface AvailableGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinGroup: (group: Group) => void;
}

export const AvailableGroupsModal = ({
  isOpen,
  onClose,
  onJoinGroup,
}: AvailableGroupsModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 6;

  // Fetch available groups
  const { data, isLoading, error } = useQuery({
    queryKey: ["availableGroups", currentPage, searchTerm, limit],
    queryFn: () => getAvailableGroups({ page: currentPage, limit: limit, search: searchTerm }),
    enabled: isOpen,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };



  const displayGroups = data?.groups ;
  const totalPages = Math.ceil((data?.totalGroups || 0 ) / limit);

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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Available Groups
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
              <form onSubmit={handleSearch} className="relative">
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
              </form>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-xl">
                  <Users size={48} className="text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Failed to load groups</p>
                </div>
              ) : displayGroups?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Users size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No groups found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayGroups?.map((group: Group) => (
                    <motion.div
                      key={group._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden transition-all duration-300"
                    >
                      <div className="h-32 overflow-hidden">
                        {group.groupImage ? (
                          <img
                            src={group.groupImage}
                            alt={group.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <Users className="text-white" size={32} />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {group.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {group.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>{group.memberCount} members</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>
                                {new Date(group.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onJoinGroup(group)}
                          disabled={group.isJoined}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            group.isJoined
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                          }`}
                        >
                          {group.isJoined ? (
                            <>
                              <Users size={16} />
                              Already Joined
                            </>
                          ) : (
                            <>
                              <UserPlus size={16} />
                              Join Group
                            </>
                          )}
                        </motion.button>
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