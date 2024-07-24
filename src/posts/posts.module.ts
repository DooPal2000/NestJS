import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
      UsersModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
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
