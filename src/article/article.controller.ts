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
import { ArticleService } from './article.service';
import { AuthAdmin } from 'src/common/auth.decorator';
import {
  InsertArticleRequest,
  InsertArticleResponse,
  UpdateArticleRequest,
} from 'src/model/article.model';
import { webResponse } from 'src/model/web.model';
import { User } from '@prisma/client';

@Controller('/api/article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}
  @Post('insert')
  async insert(
    @AuthAdmin() user: User,
    @Body() request: InsertArticleRequest,
  ): Promise<webResponse<InsertArticleResponse>> {
    const result = await this.articleService.insert(user, request);
    return {
      data: result,
    };
  }

  @Get('readArticle')
  async readArticle(
    @Query('title') title: string,
  ): Promise<webResponse<object>> {
    return {
      data: await this.articleService.readArticle(title),
    };
  }

  @Patch('updateArticle/:articleId')
  async updateArticle(
    @AuthAdmin() user: User,
    @Param('articleId', ParseIntPipe)
    articleId: number,
    @Body() request: UpdateArticleRequest,
  ): Promise<webResponse<InsertArticleResponse>> {
    request.id = articleId;
    const result = await this.articleService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('delete/:articleId')
  async delete(
    @AuthAdmin()
    @Param('articleId', ParseIntPipe)
    articleId: number,
  ): Promise<webResponse<string>> {
    const result = await this.articleService.delete(articleId);
    return {
      data: result,
    };
  }
}
