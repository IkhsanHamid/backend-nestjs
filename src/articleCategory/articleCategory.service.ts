import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ArticleCategory } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.serivce';
import { ValidationService } from 'src/common/validation.service';
import {
  ArticleCategoryResponse,
  InsertArticleCategoryRequest,
  UpdateArticleCategoryRequest,
} from 'src/model/articleCategory.model';
import { Logger } from 'winston';
import { ArticleCategoryValidation } from './articleCategory.validation';

@Injectable()
export class ArticleCategoryService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async checkIfCategoryExists(
    category: string,
    id: number,
  ): Promise<ArticleCategory> {
    let query: object;
    if (category) {
      query = {
        where: {
          category: {
            contains: category,
          },
        },
      };
    } else if (id) {
      query = {
        where: {
          id: id,
        },
      };
    }
    const articleCategory =
      await this.prismaService.articleCategory.findFirst(query);
    if (!articleCategory) throw new HttpException('Category is not found', 404);
    return articleCategory;
  }
  async insert(
    request: InsertArticleCategoryRequest,
  ): Promise<ArticleCategory> {
    this.logger.debug(
      `Insert New Article Category ${JSON.stringify(request.category)}`,
    );
    const insertArticleCategoryRequest: InsertArticleCategoryRequest =
      await this.validationService.validate(
        ArticleCategoryValidation.INSERT,
        request,
      );

    const check = await this.checkIfCategoryExists(
      insertArticleCategoryRequest.category,
      null,
    );
    if (check)
      throw new HttpException(
        'Category is exists please input different category',
        400,
      );

    const category = await this.prismaService.articleCategory.create({
      data: insertArticleCategoryRequest,
    });

    return category;
  }

  async getData(category: string): Promise<object> {
    const data = await this.prismaService.articleCategory.findMany({
      where: {
        category: {
          contains: category,
        },
      },
    });
    return data;
  }

  async update(
    request: UpdateArticleCategoryRequest,
  ): Promise<ArticleCategoryResponse> {
    this.logger.debug(`Update Article Category ${JSON.stringify(request)}`);
    const updateArticleCategoryRequest: UpdateArticleCategoryRequest =
      await this.validationService.validate(
        ArticleCategoryValidation.UPDATE,
        request,
      );
    const category = await this.checkIfCategoryExists(request.category, null);
    const result = await this.prismaService.articleCategory.update({
      where: {
        id: category.id,
      },
      data: updateArticleCategoryRequest,
    });
    return {
      id: result.id,
      category: result.category,
    };
  }

  async delete(id: number) {
    this.logger.debug(`Delete category ${JSON.stringify(id)}`);
    await this.checkIfCategoryExists(null, id);
    await this.prismaService.articleCategory.delete({
      where: {
        id: id,
      },
    });
    return 'success';
  }
}
