import { useQuery } from "@tanstack/react-query";
import { getMyArticles } from "../../services/article/articleService";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Article } from "../../types/article.type";
import { ArticleCard } from "../../components/article/ArticleCard";


const TrainerArticles = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id || "");

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: getMyArticles,
  });

  return (
    <div className="min-h-screen bg-blue-800 text-white px-4 py-10 pt-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">My Articles</h2>
          <button
            onClick={() => navigate("/trainer/articles/create")}
            className="bg-slate-800 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Create Article
          </button>
        </div>

        {isLoading ? (
          <div>
            <Skeleton height={200} animation="wave" />
            <Skeleton height={200} animation="wave" />
            <Skeleton height={200} animation="wave" />
          </div>
        ) : (
          <div className="flex flex-col gap-y-4">
            {articles?.length === 0 && (
              <p className="text-3xl mt-20 text-center">No articles found.</p>
            )}
            {articles?.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                userId={userId}
                articles={articles}
              />
            ))}
          </div>
        )}
        {error && (
          <p className="text-red-500 text-3xl mt-14 text-center">
            Error loading articles.
          </p>
        )}
      </div>
    </div>
  );
};

export default TrainerArticles;
