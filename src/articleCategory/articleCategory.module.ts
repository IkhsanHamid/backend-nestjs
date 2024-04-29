import { Module } from '@nestjs/common';
import { ArticleCategoryService } from './articleCategory.service';
import { ArticleCategoryController } from './articleCategory.controller';

@Module({
  providers: [ArticleCategoryService],
  controllers: [ArticleCategoryController],
})
export class ArticleCategoryModule {}
