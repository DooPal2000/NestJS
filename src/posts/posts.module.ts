import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AuthService } from 'src/auth/auth.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
      UsersModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
    MulterModule.register({
      limits: {
        // 바이트 단위로 입력 10MB
        fileSize: 10000000,
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb(에러, boolean)
         * 
         * 첫번째 파라미터는 에러가 있을 경우 에러 정보를 넣어준다.
         * 두번째 파라미터는 파일을 받을지 말지 boolean을 넣어준다.
         */
        // xxx.jpg -> .jpg
        const ext = extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg, jpeg, png 파일만 업로드 가능합니다.'),
            false,
          );
        }
        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, cb) {
          cb(null, POST_IMAGE_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`)
        }
      }),
    }),
    JwtModule.register({}),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    AuthService,
    UsersService,
    // AccessTokenGuard,
  ],
})
export class PostsModule { }
