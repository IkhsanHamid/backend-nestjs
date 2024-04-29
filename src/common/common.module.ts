import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.serivce';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { AuthMiddleware } from './auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService, JwtModule],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const routes = [
      { path: '/api/users/current', method: RequestMethod.GET },
      { path: '/api/article/insert', method: RequestMethod.POST },
      { path: '/api/article/delete/*', method: RequestMethod.DELETE },
      {
        path: '/api/article/updateArticle/*',
        method: RequestMethod.PATCH,
      },
      { path: '/api/category/insert', method: RequestMethod.POST },
      { path: '/api/category/delete/*', method: RequestMethod.DELETE },
      { path: '/api/category/update/*', method: RequestMethod.PUT },
      { path: '/api/comment/insert', method: RequestMethod.POST },
      { path: '/api/comment/delete/*', method: RequestMethod.DELETE },
      { path: '/api/comment/update/*', method: RequestMethod.PUT },
    ];

    consumer.apply(AuthMiddleware).forRoutes(...routes);
  }
}
