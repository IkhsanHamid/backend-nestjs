import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.serivce';
import * as bcrypt from 'bcrypt';
import { Article, ArticleCategory, ArticleComments } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}
  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'ikhsan18',
      },
    });
  }

  async getUser(): Promise<any> {
    return await this.prismaService.user.findFirst({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'ikhsan18',
        name: 'ikhsan hamid',
        password: await bcrypt.hash('12345678', 10),
        roleId: 1,
        token: 'test',
      },
    });
  }

  async deleteArticle() {
    await this.prismaService.article.deleteMany({
      where: {
        title: 'unit test',
      },
    });
  }

  async createArticle() {
    await this.prismaService.article.create({
      data: {
        title: 'unit test buat delete',
        content: 'unit test',
        authorId: 218,
        categoryId: 1,
      },
    });
  }

  async getArticle(): Promise<Article> {
    return await this.prismaService.article.findFirst({
      where: {
        title: 'unit test buat delete',
      },
    });
  }

  async deleteArticleCategory() {
    await this.prismaService.articleCategory.deleteMany({
      where: {
        category: 'unit test',
      },
    });
  }

  async getArticleCategory(): Promise<ArticleCategory> {
    return await this.prismaService.articleCategory.findFirst({
      where: {
        category: 'unit test buat delete',
      },
    });
  }

  async createArticleCategory() {
    await this.prismaService.articleCategory.create({
      data: {
        category: 'unit test buat delete',
        createdId: 218,
      },
    });
  }

  async deleteArticleComment() {
    await this.prismaService.articleComments.deleteMany({
      where: {
        comment: 'unit test',
      },
    });
  }

  async createArticleComment() {
    await this.prismaService.articleComments.create({
      data: {
        comment: 'unit test buat delete',
        commentId: 218,
        articleId: 1,
      },
    });
  }

  async getArticleComment(): Promise<ArticleComments> {
    return await this.prismaService.articleComments.findFirst({
      where: {
        comment: 'unit test buat delete',
      },
    });
  }
}
