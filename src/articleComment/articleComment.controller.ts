import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ArticleCommentService } from './articleComment.service';
import { AuthAdmin } from 'src/common/auth.decorator';
import { ArticleComments, User } from '@prisma/client';
import {
  InsertArticleCommentRequest,
  UpdateArticleCommentRequest,
  UpdateArticleCommentResponse,
} from 'src/model/articleComment.model';
import { webResponse } from 'src/model/web.model';

@Controller('/api/comment')
export class ArticleCommentController {
  constructor(private articleCommentService: ArticleCommentService) {}

  @Post('insert')
  async insert(
    @AuthAdmin() user: User,
    @Body() request: InsertArticleCommentRequest,
  ): Promise<webResponse<ArticleComments>> {
    request.commentId = user.id;
    const result = await this.articleCommentService.insert(request);
    return {
      data: result,
    };
  }

  @Get('getData')
  async getData(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<webResponse<ArticleComments[]>> {
    const result = await this.articleCommentService.getComment(skip, limit);
    return {
      data: result,
    };
  }

  @Patch('update/:commentId')
  async update(
    @AuthAdmin()
    @Param('commentId')
    commentId: number,
    @Body() request: UpdateArticleCommentRequest,
  ): Promise<webResponse<UpdateArticleCommentResponse>> {
    request.id = commentId;
    const result = await this.articleCommentService.update(request);
    return {
      data: result,
    };
  }

  @Delete('delete/:commentId')
  async delete(
    @AuthAdmin()
    @Param('commentId')
    commentId: number,
  ): Promise<webResponse<string>> {
    const result = await this.articleCommentService.delete(commentId);
    return {
      data: result,
    };
  }
}
