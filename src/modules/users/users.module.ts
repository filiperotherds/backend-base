import { Module } from '@nestjs/common'
import { GetUserProfileController } from './controllers/get-profile.controller'
import { UpdateUserAvatarController } from './controllers/update-user-avatar.controller'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PrismaService } from '@/database/prisma/prisma.service'
import { S3Module } from '@/common/services/s3/s3.module'

@Module({
  imports: [S3Module],
  controllers: [GetUserProfileController, UpdateUserAvatarController],
  providers: [UsersService, JwtAuthGuard, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
