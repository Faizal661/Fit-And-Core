import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, ThumbsUp, ThumbsUpIcon, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  upvoteArticle,
  fetchUpvotedUsers,
  deleteArticle,
} from "../../../services/article/articleService";
import { ArticleCardProps, UpvotedUsers } from "../../../types/article.type";
import { formatDate } from "../../../utils/dateFormat";
import { ERR_MESSAGES } from "../../../constants/messages/error.messages";
import { motion } from "framer-motion";
import { useToast } from "../../../context/ToastContext";
import ConfirmModal from "../modal/ConfirmModal";

export const ArticleCard = ({
  article,
  userId,
  articles,
  showEditButton = false,
}: ArticleCardProps) => {
  const [showUpvotedUsers, setShowUpvotedUsers] = useState(false);
  const [upvotedUsers, setUpvotedUsers] = useState<UpvotedUsers[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isUpvoted = article.upvotes.includes(userId);
  const { showToast } = useToast();

  const popoverRef = useRef<HTMLDivElement>(null);

  const upvoteMutation = useMutation({
    mutationFn: () => upvoteArticle(article._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => {
      console.error(ERR_MESSAGES.UPVOTE_ARTICLE_ERROR, error);
    },
  });

  const fetchUpvotedUsersMutation = useMutation({
    mutationFn: (page: number) => fetchUpvotedUsers(article._id, page, 5),
    onSuccess: (data) => {
      if (page === 1) {
        setUpvotedUsers(data.users);
      } else {
        setUpvotedUsers((prev) => [...prev, ...data.users]);
      }
      setHasMore(data.hasMore);
    },
    onError: (error) => {
      console.error("Failed to fetch upvoted users", error);
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (articleId: string) => deleteArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      showToast("success", "Article deleted successfully!");
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      console.error("Failed to delete article", error);
      showToast("error", "Failed to delete article.");
      setShowDeleteConfirm(false);
    },
  });

  const handleCardClick = () => {
    navigate(`/article/${article._id}`, { state: { articles } });
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    upvoteMutation.mutate();
  };

  const handleShowUpvotedUsers = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showUpvotedUsers) {
      setPage(1);
      fetchUpvotedUsersMutation.mutate(1);
    }
    setShowUpvotedUsers(!showUpvotedUsers);
  };

  const handleLoadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUpvotedUsersMutation.mutate(nextPage);
  };

  const handleDeleteArticle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  const handleConfirmDelete = () => {
    deleteArticleMutation.mutate(article._id);
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowUpvotedUsers(false);
      }
    };

    if (showUpvotedUsers) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUpvotedUsers, article._id]);

  const truncatedContent = `${article.content.slice(0, 150)}...`;

  return (
    <motion.div
      className="flex items-start p-6 mb-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors rounded-md shadow-sm relative"
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
    >
      <div className="flex-3 pr-6">
        <div className="mb-3">
          <span className="text-xs text-gray-500">{article.authorName}</span>
          {showEditButton && userId === article.createdBy && (
            <div className="float-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteArticle}
                disabled={deleteArticleMutation.isPending}
                className=" p-1 text-blue-900 hover:text-black hover:bg-gray-300 rounded-full"
              >
                <Trash2 size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/trainer/articles/edit/${article._id}`);
                }}
                className="p-1 text-blue-900 hover:text-black hover:bg-gray-300 rounded-full"
              >
                <Edit size={18} />
              </motion.button>
            </div>
          )}
        </div>
        <h2 className="text-lg font-normal text-gray-800 mb-3">
          {article.title}
        </h2>
        <div className="text-sm text-gray-500 mb-4 line-clamp-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {truncatedContent}
          </ReactMarkdown>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {article.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-block text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5"
              >
                #{tag}
              </span>
            ))}
            {article.tags.length > 2 && (
              <span className="text-xs text-gray-400">
                +{article.tags.length - 2}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:block">
              {formatDate(article.createdAt)}
            </span>
            <div className="relative" ref={popoverRef}>
              <motion.button
                onClick={handleUpvote}
                disabled={upvoteMutation.isPending}
                className="flex items-center text-gray-400 hover:text-gray-600 hover:cursor-pointer disabled:opacity-50 focus:outline-none"
                whileTap={{ scale: 0.95 }}
              >
                {isUpvoted ? (
                  <ThumbsUp className="w-4 h-4 text-gray-600 fill-current" />
                ) : (
                  <ThumbsUpIcon className="w-4 h-4" />
                )}
                <span className="ml-1 text-xs">{article.upvotes.length}</span>
                {article.upvotes.length > 0 && (
                  <span
                    className="ml-1 text-xs hover:underline"
                    onClick={handleShowUpvotedUsers}
                  >
                    {showUpvotedUsers ? "Hide " : `show`}
                  </span>
                )}
              </motion.button>

              {showUpvotedUsers && (
                <div
                  ref={popoverRef}
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2">
                    <div className="sticky top-2 bg-white flex flex-row justify-between items-center">
                      <h4 className="text-xs font-medium text-gray-700 ">
                        Upvoted by
                      </h4>
                      <h4
                        className="px-2 hover:bg-gray-200 rounded-full"
                        onClick={handleShowUpvotedUsers}
                      >
                        x
                      </h4>
                    </div>
                    {fetchUpvotedUsersMutation.isPending && page === 1 ? (
                      <div className="text-center py-2">Loading...</div>
                    ) : (
                      <>
                        {upvotedUsers.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center py-1 px-1 hover:bg-gray-50 rounded"
                          >
                            <img
                              src={
                                user.profilePicture || "/default-profile.png"
                              }
                              alt={user.username}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-xs text-gray-700">
                              {user.username}
                            </span>
                          </div>
                        ))}
                        {hasMore && (
                          <button
                            onClick={handleLoadMore}
                            disabled={fetchUpvotedUsersMutation.isPending}
                            className="w-full text-xs text-blue-500 mt-1 py-1 hover:bg-gray-50 rounded disabled:opacity-50"
                          >
                            {fetchUpvotedUsersMutation.isPending ? (
                              <div>
                                <div className="mx-auto border-2 w-3 h-3 border-t-white rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              "Load more"
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex-col items-end">
        <img
          src={article.thumbnail}
          alt=""
          className="w-full h-28 object-cover rounded-md"
        />
      </div>

      <ConfirmModal
        type="warning"
        title="Confirm Deletion"
        message={`Are you sure you want to delete this article? This action cannot be undone.`}
        confirmText="Delete"
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isConfirming={deleteArticleMutation.isPending}
      />
    </motion.div>
  );
};
