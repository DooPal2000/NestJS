import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';

@Module({
  // 아래 import: TypeOrmModule 작성 후 Comment 리포지토리 사용 가능 (꼭 기억)
  imports: [
    TypeOrmModule.forFeature([
      CommentsModel,
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule { }
