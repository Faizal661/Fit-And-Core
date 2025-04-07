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

export const getTrainerArticles = async () => {
  const res = await axios.get(`/article/all-articles`);
  return res.data.articles
};
