import { useNavigate } from "react-router-dom";
import { Edit, ThumbsUp, ThumbsUpIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upvoteArticle } from "../../../services/article/articleService";
import { ArticleCardProps } from "../../../types/article.type";
import { formatDate } from "../../../utils/dateFormat";
import { ERR_MESSAGES } from "../../../constants/error.messages";
import { motion } from "framer-motion";

export const ArticleCard = ({
  article,
  userId,
  articles,
  showEditButton=false
}: ArticleCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isUpvoted = article.upvotes.includes(userId);

  const upvoteMutation = useMutation({
    mutationFn: () => upvoteArticle(article._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => {
      console.error(ERR_MESSAGES.UPVOTE_ARTICLE_ERROR, error);
    },
  });

  const handleCardClick = () => {
    navigate(`/article/${article._id}`, { state: { articles } });
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    upvoteMutation.mutate();
  };

  const truncatedContent = `${article.content.slice(0, 150)}...`;

  return (
    <motion.div
      className="flex items-start p-6 mb-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors rounded-md shadow-sm" // Added rounded-md and shadow-sm for better visual appeal
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.1 } }}
    >
      <div className="flex-3 pr-6">
        <div className="mb-3">
          <span className="text-xs text-gray-500">{article.authorName}</span>
          {showEditButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                navigate(`/trainer/articles/edit/${article._id}`);
              }}
              className="float-end p-1 text-blue-900 hover:text-black hover:bg-gray-300 rounded-full"
            >
              <Edit size={18}/>
            </motion.button>
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
                className="inline-block text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5" // Added background and padding for tag appearance
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
            <motion.button
              onClick={handleUpvote}
              disabled={upvoteMutation.isPending}
              className="flex items-center text-gray-400 hover:text-gray-600 hover:cursor-pointer disabled:opacity-50 focus:outline-none" // Added focus outline reset
              whileTap={{ scale: 0.95 }} // Subtle tap feedback
            >
              {isUpvoted ? (
                <ThumbsUp className="w-4 h-4 text-gray-600 fill-current" />
              ) : (
                <ThumbsUpIcon className="w-4 h-4" />
              )}
              <span className="ml-1 text-xs">{article.upvotes.length}</span>
            </motion.button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex-col items-end">
        <img
          src={article.thumbnail}
          alt=""
          className="w-full h-28 object-cover rounded-md" // Added rounded-md to the thumbnail
        />
      </div>
    </motion.div>
  );
};
