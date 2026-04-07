import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserProfileById(id: string) {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        professionalProfile: {
          select: {
            id: true,
          },
        },
      },
      where: { id },
    })

    return user
  }
}
