export class InsertArticleRequest {
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
}

export class InsertArticleResponse {
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
}

export class UpdateArticleRequest {
  id: number;
  title?: string;
  content?: string;
  authorId?: number;
  categoryId?: number;
}
