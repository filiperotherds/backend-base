import {
  Controller,
  Delete,
  HttpCode,
  ParseFilePipeBuilder,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { CurrentUser } from '@/common/decorators/current-user-decorator'
import { TokenPayload } from '@/modules/auth/strategies/jwt.strategy'
import { S3Service } from '@/common/services/s3/s3.service'
import { UsersService } from '../users.service'

@Controller('/users/avatar')
@UseGuards(JwtAuthGuard)
export class UpdateUserAvatarController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
  ) {}

  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUser() user: TokenPayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/*',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 5, // 5MB
        })
        .build({
          errorHttpStatusCode: 422,
        }),
    )
    file: Express.Multer.File,
  ) {
    const currentUser = await this.usersService.getUserProfileById(user.sub)

    if (currentUser?.avatarUrl) {
      const oldKey = currentUser.avatarUrl.split('/uploads/').pop()
      if (oldKey) {
        await this.s3Service.deleteFile(oldKey).catch(() => {
          // Ignore error if file not found in S3
        })
      }
    }

    const { url } = await this.s3Service.uploadFile({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    })

    await this.usersService.updateUserAvatar(user.sub, url)

    return { avatarUrl: url }
  }

  @Delete()
  @HttpCode(204)
  async delete(@CurrentUser() user: TokenPayload) {
    const currentUser = await this.usersService.getUserProfileById(user.sub)

    if (currentUser?.avatarUrl) {
      const key = currentUser.avatarUrl.split('/uploads/').pop()
      if (key) {
        await this.s3Service.deleteFile(key).catch(() => {
          // Ignore error if file not found in S3
        })
      }
    }

    await this.usersService.updateUserAvatar(user.sub, null)
  }
}
