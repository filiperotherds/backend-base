import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { S3Service } from '@/common/services/s3/s3.service'

@Controller('uploads')
export class UploadsController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.s3Service.uploadFile({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    })
  }

  @Get(':key')
  async getFile(@Param('key') key: string, @Res() res: Response) {
    const url = await this.s3Service.getFileUrl(key)
    return res.redirect(url)
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteFile(key)
    return { message: 'File deleted successfully' }
  }
}
