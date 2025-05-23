export interface Article {
  _id: string;
  authorName: string;
  content: string;
  createdAt: string;
  createdBy: string;
  tags: string[];
  thumbnail: string;
  title: string;
  updatedAt?: string;
  upvotes: string[];
}

export interface ArticleCardProps {
  article: Article;
  articles: Article[];
  userId: string;
  showEditButton?:boolean;
}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

export interface GetAllArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "upvotes" | ""; 
}

export interface GetAllArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}

export interface GetMyArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "upvotes" | "";
}

export interface MyArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}


export interface UpvotedUsers {
  _id: string;
  username: string;
  profilePicture?: string;
}

export interface FetchUpvotedUsersData {
  users: UpvotedUsers[];
  hasMore: boolean;
}