import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upvoteArticle } from "../../services/article/articleService";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThumbsUp, ThumbsUpIcon, Calendar, User, Tag } from "lucide-react";
import { RootState } from "../../redux/store";
import { Article } from "../../types/article.type";
import { components } from "../../components/shared/article/MarkdownComponents";
import { formatDate } from "../../utils/dateFormat";
import PageNotFound from "../../components/shared/PageNotFound";
import Footer from "../../components/shared/Footer";
import { REDIRECT_MESSAGES } from "../../constants/redirect.messges";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants
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

const ArticleFullView = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const articles = state?.articles || [];
  const article = articles.find((a: Article) => a._id === id);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!article) {
    return (
      <PageNotFound
        message={REDIRECT_MESSAGES.ARTILCE_NOT_FOUND}
        linkText={REDIRECT_MESSAGES.ARTICLES}
        linkTo="/articles"
      />
    );
  }

  const userId = useSelector((state: RootState) => state.auth.user?.id || "");
  let isUpvoted = article.upvotes.includes(userId);

  const mutation = useMutation({
    mutationFn: () => upvoteArticle(article._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => {
      console.error("Error upvoting article:", error);
    },
  });

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoted) {
      article.upvotes = article.upvotes.filter((id: string) => id !== userId);
    } else {
      article.upvotes.push(userId);
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[60vh] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-5"></div>
          <motion.div
            animate={{ scale: 1.05 }}
            transition={{
              repeat: Infinity,
              duration: 20,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Overlay pattern */}
          <div
            className="absolute inset-0 bg-black/20 z-10 opacity-30"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>

          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="absolute inset-0 z-30 flex flex-col justify-center items-center px-6"
          >
            <motion.div variants={fadeIn} className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {article.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{article.authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag: string, index: number) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                <Tag size={14} />
                {tag}
              </motion.span>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpvote}
            disabled={mutation.isPending}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-300"
          >
            {isUpvoted ? (
              <ThumbsUp className="w-5 h-5 fill-current text-blue-500" />
            ) : (
              <ThumbsUpIcon className="w-5 h-5 text-gray-600" />
            )}
            <span className={isUpvoted ? "text-blue-500" : "text-gray-600"}>
              {article.upvotes.length}
            </span>
          </motion.button>

          <motion.div
            variants={fadeIn}
            className="prose max-w-none prose-lg prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {article.content}
            </ReactMarkdown>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleFullView;