import { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllArticles } from "../../../services/article/articleService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ArticlesResponse } from "../../../types/article.type";
import { ArticleCard } from "../../../components/article/ArticleCard";
import Footer from "../../../components/shared/footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Search, SortAsc } from "lucide-react";
import useDebounce from "../../../hooks/useDebounce";

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

const UserArticles = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id || "");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activePage, setActivePage] = useState<number>(1);
  const [recordsPerPage] = useState<number>(3);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "upvotes" | "">("");
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const { data, isLoading, error } = useQuery<ArticlesResponse, Error>({
    queryKey: [
      "articles",
      activePage,
      recordsPerPage,
      debouncedSearchTerm,
      sortBy,
    ],
    queryFn: () =>
      getAllArticles({
        page: activePage,
        limit: recordsPerPage,
        search: debouncedSearchTerm,
        sortBy: sortBy,
      }),
    staleTime: 5000,
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActivePage(1);
  };

  const handleSortChange = (value: "createdAt" | "upvotes" | "") => {
    setSortBy(value);
    setActivePage(1);
  };

  const totalPages = data ? Math.ceil(data.total / recordsPerPage) : 1;

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
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Fitness Articles
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Discover expert insights and tips to enhance your fitness journey
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 mb-16"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <form
              onSubmit={handleSearch}
              className="w-full md:w-auto flex items-center gap-2"
            >
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    handleSortChange(
                      e.target.value as "createdAt" | "upvotes" | ""
                    )
                  }
                  className="appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Sort by</option>
                  <option value="createdAt">Newest</option>
                  <option value="upvotes">Most Upvotes</option>
                </select>
                <SortAsc
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </form>

            {data?.total && (
              <p className="text-sm text-gray-500">
                {data.total} articles found
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-red-500 text-xl">Error loading articles</p>
            </motion.div>
          ) : data?.articles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-xl">No articles found</p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {data?.articles.map((article) => (
                <motion.div
                  key={article._id}
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  className="transition-all duration-300"
                >
                  <ArticleCard
                    article={article}
                    userId={userId}
                    articles={data.articles}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {data && data.total > recordsPerPage && (
            <motion.div
              variants={fadeIn}
              className="flex justify-center items-center gap-2 mt-6 p-4 flex-wrap"
            >
              {/* Previous */}
              <button
                onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="px-2 py-1 bg-purple-500 text-white rounded disabled:bg-gray-400 hover:bg-purple-700"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setActivePage(pageNum)}
                    className={`px-2 py-1 rounded 
                    ${
                      activePage === pageNum
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-purple-700 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() =>
                  setActivePage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={activePage === totalPages}
                className="px-2 py-1 bg-purple-500 text-white rounded disabled:bg-gray-400 hover:bg-purple-700"
              >
                Next
              </button>
            </motion.div>
          )}
          
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default UserArticles;
