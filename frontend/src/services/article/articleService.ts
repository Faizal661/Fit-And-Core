import {
  GetAllArticlesParams,
  GetAllArticlesResponse,
  GetMyArticlesParams,
  MyArticlesResponse,
} from "../../types/article.type";
import { ArticleFormData } from "../../schemas/articleSchema";
import api from "../../config/axios.config";

// ----------- articles
export const createTrainerArticle = async (data: ArticleFormData) => {
  const res = await api.post("/article", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getAllArticles = async ({
  page = 1,
  limit = 4,
  search,
  sortBy,
}: GetAllArticlesParams): Promise<GetAllArticlesResponse> => {
  const response = await api.get("/article", {
    params: { page, limit, search, sortBy },
  });
  return response.data;
};


// --------------- My articles 
export const getMyArticles = async (
  params: GetMyArticlesParams
): Promise<MyArticlesResponse> => {
  const res = await api.get(`/article/mine`, {
    params,
  });
  return res.data;
};

// ------------   specific article
export const fetchArticleById = async (articleId: string) => {
  const res = await api.get(`/article/${articleId}`);
  return res.data.article;
};

export const updateTrainerArticle = async (
  data: ArticleFormData & { id: string }
) => {
  const res = await api.patch(`/article/${data.id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteArticle = async (articleId: string) => {
  const res = await api.delete(`/article/${articleId}`);
  return res.data;
};

// ---------------- article interactions 
export const upvoteArticle = async (articleId: string) => {
  const response = await api.post(`/article/${articleId}/upvotes`);
  return response.data;
};

export const fetchUpvotedUsers = async (
  articleId: string,
  page: number,
  limit = 5
) => {
  const res = await api.get(`/article/${articleId}/upvotes`, {
    params: { page, limit },
  });
  return res.data;
};


