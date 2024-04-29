import { Module } from '@nestjs/common';
import { ArticleCommentService } from './articleComment.service';
import { ArticleCommentController } from './articleComment.controller';

@Module({
  providers: [ArticleCommentService],
  controllers: [ArticleCommentController],
})
export class ArticleCommentModule {}
