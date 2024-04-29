import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';

describe('Article Controller', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/article/insert', () => {
    beforeEach(async () => {
      await testService.deleteArticle();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/article/insert')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          title: '',
          content: '',
          authorId: '',
          categoryId: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/article/insert')
        .set('Authorization', `Bearer test`)
        .send({
          title: 'unit test',
          content: 'unit test',
          authorId: 218,
          categoryId: 1,
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('shoul be able to insert article', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/article/insert')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          title: 'unit test',
          content: 'unit test',
          authorId: 218,
          categoryId: 1,
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/article/readArticle', () => {
    it('should be able get article', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/article/readArticle?title=test',
      );

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PATCH /api/article/updateArticle/:articleId', () => {
    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/article/updateArticle/1')
        .set('Authorization', `Bearer test`)
        .send({
          title: 'unit test updated',
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected because id not found', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/article/updateArticle/100000')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          title: 'unit test updated',
        });

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update article', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/article/updateArticle/1')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          title: 'unit test updated',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('DELETE /api/article/delete/:articleId', async () => {
    beforeEach(async () => {
      await testService.createArticle();
    });
    it('should be rejected if token is invalid', async () => {
      const article = await testService.getArticle();
      const response = await request(app.getHttpServer())
        .delete(`/api/article/delete/${article.id}`)
        .set('Authorization', `Bearer test`);

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if id is not found', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/article/delete/40000`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`);

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete', async () => {
      const article = await testService.getArticle();
      const response = await request(app.getHttpServer())
        .delete(`/api/article/delete/${article.id}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });
});
