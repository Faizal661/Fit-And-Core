import axios from "../../config/axios.config";
import { ArticleFormData } from "../../schemas/articleSchema";

export const createTrainerArticle = async (data: ArticleFormData) => {
  const res = await axios.post("/article/create-article", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getMyArticles = async () => {
  const res = await axios.get(`/article/my-articles`);
  return res.data.articles
};
