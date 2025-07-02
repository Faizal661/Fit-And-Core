import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, User, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query"; // Assuming you use TanStack Query
import ImageViewModal from "../modal/ImageViewModal";
import { getGroupDetails } from "../../services/community/groupService";
import { GroupDetails } from "../../types/group.type";



interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

export const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  isOpen,
  onClose,
  groupId,
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const {
    data: groupDetails,
    isLoading,
    isError,
    error,
  } = useQuery<GroupDetails, Error>({
    queryKey: ["groupDetails", groupId],
    queryFn: () => getGroupDetails(groupId),
    enabled: isOpen && !!groupId,
    staleTime: 5 * 60 * 1000,
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Group Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            {isLoading ? (
              <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                <Loader2
                  className="animate-spin text-blue-500 mb-4"
                  size={32}
                />
                <p className="text-gray-600">Loading group details...</p>
              </div>
            ) : isError ? (
              <div className="p-6 text-center text-red-500">
                <p>
                  Error: {error?.message || "Failed to load group details."}
                </p>
                <p className="text-sm text-gray-500 mt-2">Please try again.</p>
              </div>
            ) : groupDetails ? (
              <div className="p-6">
                {/* Group Info */}
                <div className="flex flex-col items-center mb-6">
                  {groupDetails.avatar ? (
                    <img
                      src={groupDetails.avatar}
                      alt={groupDetails.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md mb-3  hover:cursor-pointer"
                      onClick={() => setCurrentImageUrl(groupDetails.avatar!)}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-3">
                      <Users className="text-white" size={40} />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {groupDetails.name}
                  </h3>
                  {groupDetails.description && (
                    <p className="text-gray-600 text-center text-sm px-4">
                      {groupDetails.description}
                    </p>
                  )}
                </div>

                {/* Member List */}
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users size={20} /> Members ({groupDetails.members.length})
                  </h4>
                  <ul className="space-y-3 overflow-y-auto max-h-52">
                    {groupDetails.members.map((member) => (
                      <li key={member._id} className="flex items-center gap-3">
                        {member.profilePicture ? (
                          <img
                            src={member.profilePicture}
                            alt={member.username}
                            className="w-10 h-10 rounded-full object-cover hover:cursor-pointer"
                            onClick={() =>
                              setCurrentImageUrl(member.profilePicture!)
                            }
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={18} className="text-gray-500" />
                          </div>
                        )}
                        <span className="text-gray-800 font-medium">
                          {member.username}
                        </span>
                        {/* You can add online status here if member object includes it */}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            {/* Image View Modal */}
            <ImageViewModal
              imageUrl={currentImageUrl}
              onClose={() => setCurrentImageUrl(null)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
