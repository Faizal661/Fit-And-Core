import { useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsUpIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upvoteArticle } from "../../services/article/articleService";
import { ArticleCardProps } from "../../types/article.type";
import { formatDate } from "../../utils/dateFormat";

export const ArticleCard = ({
  article,
  userId,
  articles,
}: ArticleCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isUpvoted = article.upvotes.includes(userId);

  const mutation = useMutation({
    mutationFn: () => upvoteArticle(article._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => {
      console.error("Error upvoting article:", error);
    },
  });

  const handleCardClick = () => {
    navigate(`/article/${article._id}`, { state: { articles } });
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutation.mutate();
  };

  const truncatedContent = `${article.content.slice(0, 150)}...`;

return (
  <div
    className="flex items-start p-6 mb-4 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
    onClick={handleCardClick}
  >
    <div className="flex-3 pr-6">
      <div className="mb-3">
        <span className="text-xs text-gray-500">
          {article.authorName}
        </span>
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
              className="text-xs text-gray-500"
            >
              #{tag}
            </span>
          ))}
          {article.tags.length > 2 && (
            <span className="text-xs text-gray-400">+{article.tags.length - 2}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:block">
            {formatDate(article.createdAt)}
          </span>
          <button
            onClick={handleUpvote}
            disabled={mutation.isPending}
            className="flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            {isUpvoted ? (
              <ThumbsUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ThumbsUpIcon className="w-4 h-4" />
            )}
            <span className="ml-1 text-xs">{article.upvotes.length}</span>
          </button>
        </div>
      </div>
    </div>
    <div className="flex-1 flex-col items-end">
      <img
        src={article.thumbnail}
        alt=""
        className="w-full h-28 object-cover"
      />
    </div>
  </div>
);
};
