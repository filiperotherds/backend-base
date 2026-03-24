import { PrismaService } from '@/database/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationByUserId(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        organization: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            cpfCnpj: true,
            email: true,
          },
        },
      },
    })

    if (!user?.organization) {
      throw new BadRequestException('Organization Not Found.')
    }

    return {
      organization: user.organization,
    }
  }
}
