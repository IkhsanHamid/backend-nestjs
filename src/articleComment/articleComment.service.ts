import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ArticleComments } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.serivce';
import { ValidationService } from 'src/common/validation.service';
import {
  InsertArticleCommentRequest,
  UpdateArticleCommentRequest,
  UpdateArticleCommentResponse,
} from 'src/model/articleComment.model';
import { Logger } from 'winston';
import { ArticleCommentValidation } from './articleComment.validation';

@Injectable()
export class ArticleCommentService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async checkIfCommentExists(id: number): Promise<ArticleComments> {
    const result = await this.prismaService.articleComments.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) throw new HttpException('comment tidak ditemukan', 404);
    return result;
  }

  async insert(request: InsertArticleCommentRequest): Promise<ArticleComments> {
    this.logger.debug(
      `Insert New Article Comments ${JSON.stringify(request.comment)}`,
    );
    const insertArticleCommentRequest: InsertArticleCommentRequest =
      await this.validationService.validate(
        ArticleCommentValidation.INSERT,
        request,
      );

    const comment = await this.prismaService.articleComments.create({
      data: insertArticleCommentRequest,
    });
    return comment;
  }

  async getComment(skip: number, limit: number): Promise<ArticleComments[]> {
    const data = await this.prismaService.articleComments.findMany({
      skip: skip,
      take: limit,
    });
    return data;
  }

  async update(
    request: UpdateArticleCommentRequest,
  ): Promise<UpdateArticleCommentResponse> {
    this.logger.debug(`Update Article Comment ${JSON.stringify(request)}`);
    const updateArticleCommentRequest: UpdateArticleCommentRequest =
      await this.validationService.validate(
        ArticleCommentValidation.UPDATE,
        request,
      );

    const comment = await this.checkIfCommentExists(
      updateArticleCommentRequest.id,
    );
    const result = await this.prismaService.articleComments.update({
      where: {
        id: comment.id,
      },
      data: updateArticleCommentRequest,
    });
    return result;
  }

  async delete(id: number): Promise<string> {
    this.logger.debug(`Delete comment ${JSON.stringify(id)}`);
    await this.checkIfCommentExists(id);
    await this.prismaService.articleComments.delete({
      where: {
        id: id,
      },
    });
    return 'success';
  }
}
