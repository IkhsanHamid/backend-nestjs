import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ArticleCategory, User } from '@prisma/client';
import { AuthAdmin } from 'src/common/auth.decorator';
import {
  ArticleCategoryResponse,
  InsertArticleCategoryRequest,
  UpdateArticleCategoryRequest,
} from 'src/model/articleCategory.model';
import { webResponse } from 'src/model/web.model';
import { ArticleCategoryService } from './articleCategory.service';

@Controller('/api/category')
export class ArticleCategoryController {
  constructor(private articleCategoryService: ArticleCategoryService) {}
  @Post('insert')
  async insert(
    @AuthAdmin() user: User,
    @Body() request: InsertArticleCategoryRequest,
  ): Promise<webResponse<ArticleCategory>> {
    request.createdId = user.id;
    const result = await this.articleCategoryService.insert(request);
    return {
      data: result,
    };
  }

  @Get('getData')
  async getData(
    @Query('category') category: string,
  ): Promise<webResponse<object>> {
    const result = await this.articleCategoryService.getData(category);
    return {
      data: result,
    };
  }

  @Patch('update/:categoryId')
  async update(
    @AuthAdmin()
    @Body()
    @Param('categoryId', ParseIntPipe)
    categoryId: number,
    request: UpdateArticleCategoryRequest,
  ): Promise<webResponse<ArticleCategoryResponse>> {
    request.id = categoryId;
    const result = await this.articleCategoryService.update(request);
    return {
      data: result,
    };
  }

  @Delete('delete/:categoryId')
  async delete(
    @AuthAdmin()
    @Param('categoryId', ParseIntPipe)
    categoryId: number,
  ): Promise<webResponse<string>> {
    const result = await this.articleCategoryService.delete(categoryId);
    return {
      data: result,
    };
  }
}
