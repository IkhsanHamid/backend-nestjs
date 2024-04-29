import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.serivce';
import { ValidationService } from 'src/common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Article, User } from '@prisma/client';
import {
  InsertArticleRequest,
  InsertArticleResponse,
  UpdateArticleRequest,
} from 'src/model/article.model';
import { Logger } from 'winston';
import { ArticleValidation } from './article.validation';

@Injectable()
export class ArticleService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}
  async insert(
    user: User,
    request: InsertArticleRequest,
  ): Promise<InsertArticleResponse> {
    this.logger.debug(`Insert New Article ${JSON.stringify(request.title)}`);
    const insertArticleRequest: InsertArticleRequest =
      this.validationService.validate(ArticleValidation.INSERT, request);

    const article = await this.prismaService.article.create({
      data: insertArticleRequest,
    });
    return {
      title: article.title,
      content: article.content,
      authorId: article.authorId,
      categoryId: article.categoryId,
    };
  }

  async readArticle(title: string): Promise<object> {
    this.logger.debug(`Read Article ${JSON.stringify(title)}`);
    const article = await this.prismaService.article.findMany({
      where: {
        title: {
          contains: title,
        },
      },
    });

    return article;
  }

  async checkArticleExist(id: number): Promise<Article> {
    console.log(id);
    const article = await this.prismaService.article.findUnique({
      where: {
        id: id,
      },
    });
    if (!article) {
      throw new HttpException('Article is not found', 404);
    }
    return article;
  }

  async update(
    user: User,
    request: UpdateArticleRequest,
  ): Promise<InsertArticleResponse> {
    this.logger.debug(`Update Article ${JSON.stringify(request)}`);
    const updateArticleRequest: UpdateArticleRequest =
      await this.validationService.validate(ArticleValidation.UPDATE, request);

    const article = await this.checkArticleExist(updateArticleRequest.id);
    const result = this.prismaService.article.update({
      where: {
        id: article.id,
      },
      data: updateArticleRequest,
    });

    return result;
  }

  async delete(id: number): Promise<string> {
    this.logger.debug(`Delete Article ${JSON.stringify(id)}`);
    await this.checkArticleExist(id);
    await this.prismaService.article.delete({
      where: {
        id: id,
      },
    });
    return 'success';
  }
}
