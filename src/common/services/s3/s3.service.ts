import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Upload } from '@aws-sdk/lib-storage'
import { Env } from '@/config/env'

@Injectable()
export class S3Service {
  private client: S3Client
  private bucket: string

  constructor(private configService: ConfigService<Env, true>) {
    this.bucket = this.configService.get('STORAGE_BUCKET', { infer: true })

    this.client = new S3Client({
      endpoint: this.configService.get('STORAGE_ENDPOINT', { infer: true }),
      region: this.configService.get('REGION', { infer: true }),
      credentials: {
        accessKeyId: this.configService.get('STORAGE_KEY', { infer: true }),
        secretAccessKey: this.configService.get('STORAGE_SECRET', {
          infer: true,
        }),
      },
      forcePathStyle: true, // Often needed for compatible S3 services (like Cloudflare R2 or localstack)
    })
  }

  generatePersistentUrl(key: string) {
    const appUrl = this.configService.get('APP_URL', { infer: true })
    return `${appUrl}/uploads/${key}`
  }

  async uploadFile(file: {
    buffer: Buffer
    originalname: string
    mimetype: string
  }) {
    const key = `${Date.now()}-${file.originalname}`

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    })

    await upload.done()

    return {
      key,
      url: this.generatePersistentUrl(key),
    }
  }

  async getFileUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    // URL valid for 1 hour
    return await getSignedUrl(this.client, command, { expiresIn: 3600 })
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    await this.client.send(command)
  }
}
