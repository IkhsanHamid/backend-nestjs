export class InsertArticleCommentRequest {
  comment: string;
  commentId: number;
  articleId: number;
}

export class UpdateArticleCommentRequest {
  id: number;
  comment: string;
}

export class UpdateArticleCommentResponse {
  id: number;
  comment: string;
}
