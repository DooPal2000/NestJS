import { BadRequestException, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entity/posts.entity';
import { AuthService } from 'src/auth/auth.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';
import { ImageModel } from 'src/common/entity/image.entity';
import { PostsImagesService } from './image/images.service';
import { LogMiddleware } from 'src/common/middleware/log.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
      UsersModel,
      ImageModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
    JwtModule.register({}),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsImagesService,
    // AuthService,
    // UsersService,
    // AccessTokenGuard,
  ],
})
export class PostsModule {} 
