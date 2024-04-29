import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TestModule } from './test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';

describe('Article Comment Controller', () => {
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

  describe('POST /api/comment/insert', () => {
    beforeEach(async () => {
      await testService.deleteArticleComment();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/comment/insert')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          comment: '',
          articleId: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/comment/insert')
        .set('Authorization', `Bearer test`)
        .send({
          comment: 'unit test',
          articleId: 1,
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to insert article category', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/comment/insert')
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          comment: 'unit test',
          articleId: 1,
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/comment/getData', () => {
    it('should be able get article category', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/comment/getData',
      );

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PATCH /api/comment/update/:commentId', () => {
    beforeEach(async () => {
      await testService.createArticleComment();
      await testService.deleteArticleComment();
    });

    it('should be rejected if request is invalid', async () => {
      const comment = await testService.getArticleComment();
      const response = await request(app.getHttpServer())
        .patch(`/api/comment/update/${comment.id}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          comment: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if id is not found', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/comment/update/1000`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          comment: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if token is invalid', async () => {
      const comment = await testService.getArticleComment();
      const response = await request(app.getHttpServer())
        .patch(`/api/comment/update/${comment.id}`)
        .set('Authorization', `Bearer test`)
        .send({
          comment: 'unit test updated',
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to insert article comment', async () => {
      const comment = await testService.getArticleComment();
      const response = await request(app.getHttpServer())
        .post(`/api/category/update/${comment.id}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`)
        .send({
          comment: 'unit test updated',
        });

      logger.info(response.body);
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('DELETE /api/comment/delete/:commentId', () => {
    beforeEach(async () => {
      await testService.createArticleComment();
    });

    it('should be rejected if token is invalid', async () => {
      const comment = await testService.getArticleComment();
      const response = await request(app.getHttpServer())
        .delete(`/api/comment/delete/${comment.id}`)
        .set('Authorization', `Bearer test`);

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if id is not found', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/comment/delete/40000`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`);

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete', async () => {
      const comment = await testService.getArticleComment();
      const response = await request(app.getHttpServer())
        .delete(`/api/comment/delete/${comment.id}`)
        .set('Authorization', `Bearer ${process.env.TOKEN}`);

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });
});
