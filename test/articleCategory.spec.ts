import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';

describe('Article Category Controller', () => {
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

  describe('POST /api/category/insert', () => {
    beforeEach(async () => {
      await testService.deleteArticleCategory();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/category/insert')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          category: '',
          createdId: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/category/insert')
        .set('Authorization', `Bearer test`)
        .send({
          category: 'unit test',
          createdId: 218,
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to insert article category', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/category/insert')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          category: 'unit test',
          createdId: 218,
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/category/getData', () => {
    it('should be able get article category', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/category/getData?category=test',
      );

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PATCH /api/category/update/:articelId', async () => {
    beforeEach(async () => {
      await testService.createArticleCategory();
      await testService.deleteArticleCategory();
    });
    it('should be rejected if request is invalid', async () => {
      const category = await testService.getArticleCategory();
      const response = await request(app.getHttpServer())
        .patch(`/api/category/update/${category.id}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          category: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if id is not found', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/category/update/1000`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          category: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if token is invalid', async () => {
      const category = await testService.getArticleCategory();
      const response = await request(app.getHttpServer())
        .patch(`/api/category/update/${category.id}`)
        .set('Authorization', `Bearer test`)
        .send({
          category: 'unit test updated',
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to insert article category', async () => {
      const category = await testService.getArticleCategory();
      const response = await request(app.getHttpServer())
        .post(`/api/category/update/${category.id}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          category: 'unit test updated',
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('DELETE /api/category/delete/:categoryId', async () => {
    beforeEach(async () => {
      await testService.createArticleCategory();
    });

    it('should be rejected if token is invalid', async () => {
      const category = await testService.getArticleCategory();
      const response = await request(app.getHttpServer())
        .delete(`/api/category/delete/${category.id}`)
        .set('Authorization', `Bearer test`);

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if id is not found', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/category/delete/40000`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`);

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete', async () => {
      const category = await testService.getArticleCategory();
      const response = await request(app.getHttpServer())
        .delete(`/api/category/delete/${category.id}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });
});
