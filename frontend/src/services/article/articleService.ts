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

export const Articles = async () => {
  const res = await axios.get(`/article/all-articles`);
  return res.data.articles
};


export const getAllArticles = async ({
  page = 1,
  limit = 5,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await axios.get('/article/all-articles', {
    params: { page, limit, search },
  });
  return response.data; // { articles, total, page, limit }
};