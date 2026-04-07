import { PrismaService } from '@/database/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationByUserId(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        professionalProfile: true,
      },
    })

    if (!user) {
      throw new BadRequestException('User Not Found.')
    }

    // Stub mapped with existing new schema fields
    return {
      organization: {
        id: user.professionalProfile?.id || user.id,
        name: user.name || '',
        avatarUrl: user.avatarUrl,
        cnpj: user.cpf, // fallback to cpf
      },
    }
  }
}
