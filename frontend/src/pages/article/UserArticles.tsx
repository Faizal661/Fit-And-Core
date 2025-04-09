import { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllArticles } from "../../services/article/articleService";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ArticlesResponse } from "../../types/article.type";
import { ArticleCard } from "../../components/article/ArticleCard";

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
    <div className="min-h-screen bg-blue-800 text-white px-4 py-10 pt-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-semibold">Articles</h2>

          {/* Single Search Input */}
          <form
            onSubmit={handleSearch}
            className="flex items-center border-2 border-black rounded-lg bg-slate-200"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, trainer name, or tags..."
              className="px-4 py-2 text-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>
        <p className="flex justify-end mb-3 pe-1">Total Articles : {data?.total}</p>

        {isLoading ? (
          <div>
            <Skeleton height={200} animation="wave" />
            <Skeleton height={200} animation="wave" />
            <Skeleton height={200} animation="wave" />
          </div>
        ) : (
          <div className="flex flex-col gap-y-4">
            {data?.articles.length === 0 && (
              <p className="text-3xl mt-20 text-center">No articles found.</p>
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
          <p className="text-red-500 text-3xl mt-14 text-center">
            Error loading articles.
          </p>
        )}

        {/* Pagination */}
        {data && data.total > recordsPerPage && (
          <div className="flex justify-center gap-x-10 items-center mt-6 ">
            <button
              onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
              disabled={activePage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-l-md disabled:bg-gray-400 hover:bg-blue-700"
            >
              Previous
            </button>
            <span>
              Page {activePage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setActivePage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={activePage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md disabled:bg-gray-400 hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserArticles;
