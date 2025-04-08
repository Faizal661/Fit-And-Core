import { useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsUpIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleCardProps } from "../../types/article.type";
import { formatDate } from "../../utils/dateFormat";

export const ArticleCard = ({
  article,
  userId,
  articles,
}: ArticleCardProps) => {
  const navigate = useNavigate();
  const isUpvoted = article.upvotes.includes(userId);

  const handleCardClick = () => {
    navigate(`/article/${article._id}`, { state: { articles } });
  };

  const truncatedContent = `${article.content.slice(0, 150)}...`;

  return (
    <div
      className="flex items-start p-4 bg-white rounded-sm shadow-md cursor-pointer hover:shadow-lg transition-shadow "
      onClick={handleCardClick}
    >
      <div className="flex-3 pr-4 ">
        <div className="flex items-center justify-between mb-2">
          {/* <span className="text-sm text-gray-600">{article.authorName}</span> */}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {article.title}
        </h2>
        <div className="text-gray-600 mb-2 line-clamp-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {truncatedContent}
          </ReactMarkdown>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 flex-col items-end mt-1">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-32 object-cover rounded-md mb-2 "
        />
        <div className="flex justify-between items-center">
          <span className="text-sm  text-gray-400">
            {formatDate(article.createdAt)}
          </span>
          <button className="flex items-center text-gray-600 hover:text-blue-600">
            {isUpvoted ? (
              <ThumbsUp className="w-5 h-5 fill-current text-blue-400" />
            ) : (
              <ThumbsUpIcon className="w-5 h-5" />
            )}
            <span className="ml-1">{article.upvotes.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
