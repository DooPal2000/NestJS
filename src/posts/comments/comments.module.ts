import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PostExistsMiddleware } from './middleware/post-exists.middleware';
import { PostsModule } from '../posts.module';

@Module({
  // 아래 import: TypeOrmModule 작성 후 Comment 리포지토리 사용 가능 (꼭 기억)
  imports: [
    TypeOrmModule.forFeature([
      CommentsModel,
    ]),
    CommonModule,
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PostExistsMiddleware)
      .forRoutes(CommentsController);
  }
}
