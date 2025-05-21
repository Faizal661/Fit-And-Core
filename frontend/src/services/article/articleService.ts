import api from "../../config/axios.config";
import { ArticleFormData } from "../../schemas/articleSchema";
import {
  GetAllArticlesParams,
  GetAllArticlesResponse,
  GetMyArticlesParams,
  MyArticlesResponse,
} from "../../types/article.type";

export const createTrainerArticle = async (data: ArticleFormData) => {
  const res = await api.post("/article/create-article", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getMyArticles = async (
  params: GetMyArticlesParams
): Promise<MyArticlesResponse> => {
  const res = await api.get(`/article/my-articles`, {
    params,
  });
  return res.data;
};

export const Articles = async () => {
  const res = await api.get(`/article/all-articles`);
  return res.data.articles;
};

export const getAllArticles = async ({
  page = 1,
  limit = 4,
  search,
  sortBy,
}: GetAllArticlesParams): Promise<GetAllArticlesResponse> => {
  const response = await api.get("/article/all-articles", {
    params: { page, limit, search, sortBy },
  });
  return response.data;
};

export const upvoteArticle = async (articleId: string) => {
  const response = await api.post(`/article/${articleId}/upvote`);
  return response.data;
};

export const fetchArticleById = async (articleId: string) => {
  const res = await api.get(`/article/${articleId}`);
  return res.data.article;
};

export const updateTrainerArticle = async (
  data: ArticleFormData & { id: string }
) => {
  const res = await api.patch(`/article/update-article/${data.id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetchUpvotedUsers = async (
  articleId: string,
  page: number,
  limit=5
) => {
  const res = await api.get(`/article/${articleId}/upvoters`, {
    params: { page, limit },
  });
  return res.data;
};

export const deleteArticle = async (articleId:string)=>{
  const res = await api.delete(`/article/${articleId}`);
  return res.data;
}