import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestMiddleware, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModel } from './posts/entity/posts.entity';
import { UsersModel } from './users/entity/users.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ENV_DB_DATABASE_KEY, ENV_DB_HOST_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEY, } from './common/const/env-keys.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';
import { ImageModel } from './common/entity/image.entity';
import { LogMiddleware } from './common/middleware/log.middleware';
import { ChatsModule } from './chats/chats.module';
import { ChatsModel } from './chats/entity/chats.entity';
import { MessagesModel } from './chats/messages/entity/messages.entity';
import { CommentsModule } from './posts/comments/comments.module';
import { CommentsModel } from './posts/comments/entity/comments.entity';
import { RolesGuard } from './users/guard/roles.guard';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';
import { UserFollowersModel } from './users/entity/user-followers.entity';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public'
    }),
    TypeOrmModule.forRoot({
      // 데이터베이스 타입
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_DATABASE_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [
        PostsModel,
        UsersModel,
        ImageModel,
        ChatsModel,
        MessagesModel,
        CommentsModel,
        UserFollowersModel,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CommonModule,
    ChatsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
  {
    // 모든 api 를 private 로 만든 건데, 이를 개선해야 한다. public 으로 개별 api 를 지정해야 한다. (이 방법이 더 실무적이다.)
    provide: APP_GUARD,
    useClass: AccessTokenGuard
  },
   {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      LogMiddleware,
    ).forRoutes({
      // path: 'posts*',
      path: '*',
      method: RequestMethod.ALL
    });
  }
}
