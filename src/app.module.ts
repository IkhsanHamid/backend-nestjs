import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { ArticleCategoryModule } from './articleCategory/articleCategory.module';
import { ArticleCommentModule } from './articleComment/articleComment.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    ArticleModule,
    ArticleCategoryModule,
    ArticleCommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
