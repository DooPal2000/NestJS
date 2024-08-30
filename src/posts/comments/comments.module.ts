import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  // 아래 import: TypeOrmModule 작성 후 Comment 리포지토리 사용 가능 (꼭 기억)
  imports: [
    TypeOrmModule.forFeature([
      CommentsModel,
    ]),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule { }
