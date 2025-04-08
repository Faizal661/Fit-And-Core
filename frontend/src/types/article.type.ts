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
}