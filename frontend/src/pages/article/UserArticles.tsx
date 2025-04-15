import { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllArticles } from "../../services/article/articleService";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ArticlesResponse } from "../../types/article.type";
import { ArticleCard } from "../../components/article/ArticleCard";
import Footer from "../../components/shared/Footer";

const UserArticles = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id || "");

  const [activePage, setActivePage] = useState<number>(1);
  const [recordsPerPage] = useState<number>(4);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, isLoading, error } = useQuery<ArticlesResponse, Error>({
    queryKey: ["articles", activePage, recordsPerPage, searchTerm],
    queryFn: () =>
      getAllArticles({
        page: activePage,
        limit: recordsPerPage,
        search: searchTerm,
      }),
    staleTime: 5000,
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActivePage(1);
  };

  const totalPages = data ? Math.ceil(data.total / recordsPerPage) : 1;

  return (
    <div>
      <div className="min-h-screen bg-slate-200 px-8 py-10 pt-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-xl text-gray-800">Articles</h2>
  
            <form
              onSubmit={handleSearch}
              className="flex items-center border border-gray-900"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles"
                className="px-4 py-2 text-gray-800 focus:outline-none text-sm w-64"
              />
              <button
                type="submit"
                className="px-4 py-2 border-l border-gray-200 text-gray-200 bg-black hover:bg-gray-50 text-sm transition-colors"
              >
                Search
              </button>
            </form>
          </div>
          
          <p className="text-xs text-gray-800 mb-6 text-right">
            {data?.total} articles
          </p>
  
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton height={120} animation="wave" />
              <Skeleton height={120} animation="wave" />
              <Skeleton height={120} animation="wave" />
            </div>
          ) : (
            <div className="flex flex-col gap-y-6">
              {data?.articles.length === 0 && (
                <p className="text-sm text-gray-800 py-12 text-center">No articles found.</p>
              )}
              {data?.articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  userId={userId}
                  articles={data.articles}
                />
              ))}
            </div>
          )}
          
          {error && (
            <p className="text-gray-500 text-sm py-12 text-center">
              Error loading articles.
            </p>
          )}
  
          {/* Pagination */}
          {data && data.total > recordsPerPage && (
            <div className="flex justify-between items-center mt-12 border-t border-gray-100 pt-6 text-sm">
              <button
                onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="text-gray-600 hover:text-gray-800 disabled:text-gray-300 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs text-gray-600">
                Page {activePage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setActivePage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={activePage === totalPages}
                className="text-gray-600 hover:text-gray-800 disabled:text-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserArticles;
