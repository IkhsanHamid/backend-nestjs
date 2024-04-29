export class InsertArticleCategoryRequest {
  category: string;
  createdId: number;
}

export class UpdateArticleCategoryRequest {
  id: number;
  category: string;
}

export class ArticleCategoryResponse {
  id: number;
  category: string;
}
