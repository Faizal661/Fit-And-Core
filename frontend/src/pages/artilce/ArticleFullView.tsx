import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux"; // Assuming you're using Redux for user state
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThumbsUp, ThumbsUpIcon } from "lucide-react";
import { RootState } from "../../redux/store";
import { Article } from "../../types/article.type";
import { components } from "../../components/article/MarkdownComponents";
import { formatDate } from "../../utils/dateFormat";

const ArticleFullView = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const userId = useSelector((state: RootState) => state.auth.user?.id || "");
  const articles = state?.articles || [];
  const article = articles.find((a: Article) => a._id === id);

  if (!article) return <div>Article not found</div>;

  const isUpvoted = article.upvotes.includes(userId);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg pt-16">
      <img
        src={article.thumbnail}
        alt={article.title}
        className="w-full  object-cover rounded-t-lg mb-4"
      />
      <div className="flex items-center justify-between mb-8">
        <span className="text-md font-medium text-gray-800">{article.authorName}</span>
        <div className=" flex items-center">
          <span className="text-sm font-medium text-gray-400 mr-4">
            {formatDate(article.createdAt)}
          </span>
          <button className="flex items-center text-gray-600 hover:text-blue-600 hover:cursor-pointer">
            {isUpvoted ? (
              <ThumbsUp className="w-6 h-6 fill-current text-blue-600" />
            ) : (
              <ThumbsUpIcon className="w-5 h-5" />
            )}
            <span className="ml-2">{article.upvotes.length}</span>
          </button>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="text-sm bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="prose max-w-none pb-16">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {article.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ArticleFullView;
