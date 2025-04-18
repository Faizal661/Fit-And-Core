import { useQuery } from "@tanstack/react-query";
import { getMyArticles } from "../../services/article/articleService";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ArticlesResponse } from "../../types/article.type";
import { ArticleCard } from "../../components/shared/article/ArticleCard";
import { useState, FormEvent } from "react";
import Footer from "../../components/shared/Footer";

const TrainerArticles = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id || "");

  const [activePage, setActivePage] = useState<number>(1);
  const [recordsPerPage] = useState<number>(4);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "upvotes" | "">("");

  const { data, isLoading, error } = useQuery<ArticlesResponse>({
    queryKey: ["articles", activePage, recordsPerPage, searchTerm, sortBy],
    queryFn: () =>
      getMyArticles({
        page: activePage,
        limit: recordsPerPage,
        search: searchTerm,
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
    <div className="min-h-screen bg-slate-100 text-black px-4 py-10 pt-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">My Articles</h2>
          <button
            onClick={() => navigate("/trainer/articles/create")}
            className="border-1 hover:bg-black px-4 py-2 hover:text-white"
          >
            Create Article
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-gray-900 ">
            <span className="px-3 text-sm text-gray-900 hidden sm:block">Sort By:</span>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) =>
                handleSortChange(e.target.value as "createdAt" | "upvotes" | "")
              }
              className="appearance-none  bg-transparent border-l border-gray-900 px-3 py-2 text-sm text-black focus:outline-none"
            >
              <option value="">None</option>
              <option value="createdAt">Newest</option>
              <option value="upvotes">Most Upvotes</option>
            </select>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center border border-gray-900 "
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search my articles title and tags"
              className="px-3 py-2 text-slate-900 bg-transparent focus:outline-none text-sm w-64"
            />
            <button
              type="submit"
              className="px-3 py-2 hidden sm:block border-l border-gray-900 text-gray-900 bg-transparent hover:text-white hover:bg-black text-sm transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {isLoading ? (
          <div>
            <Skeleton height={200} animation="wave" />
            <Skeleton height={200} animation="wave" />
            <Skeleton height={200} animation="wave" />
          </div>
        ) : (
          <div>
            {data?.articles.length === 0 ? (
              <p className="text-3xl my-52 text-center text-gray-500 ">
                No articles found.
              </p>
            ) : (
              <div className="flex flex-col gap-y-6">
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

            {data && data.total > recordsPerPage && (
              <div className="flex justify-between items-center my-12 border-t border-gray-500 pt-6 text-sm">
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
        )}
        {error && (
          <p className="text-red-500 text-3xl mt-14 text-center">
            Error loading articles.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrainerArticles;
