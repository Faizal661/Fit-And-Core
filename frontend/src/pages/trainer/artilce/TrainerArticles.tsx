import { useQuery } from "@tanstack/react-query";
import { getTrainerArticles } from "../../../services/article/articleService";
import { useNavigate } from "react-router-dom";

interface Article {
    _id: string;
    title: string;
    category: string;
    content: string;

}
  
const TrainerArticles = () => {
  const navigate = useNavigate();

  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ["trainerArticles"],
    queryFn: getTrainerArticles,
  });

  return (
    <div className="min-h-screen bg-blue-800 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">My Articles</h2>
          <button
            onClick={() => navigate("/trainer/articles/create")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 "
          >
            Create Article
          </button>
        </div>

        {isLoading && <p>Loading articles...</p>}
        {error && <p>Error loading articles.</p>}

        {articles?.length === 0 && <p>No articles found.</p>}
        {articles?.map((article) => (
          <div key={article._id} className="bg-blue-900 p-4 mb-4 rounded">
            <h3 className="text-lg font-semibold">{article.title}</h3>
            <p className="text-sm text-blue-300">{article.category}</p>
            <p className="text-sm mt-2 line-clamp-2">
              {article.content.slice(0, 150)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerArticles;
