import { PrismaService } from '@/database/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class EstimatesService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationEstimates(sub: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
      select: {
        organization: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!user?.organization) {
      throw new BadRequestException('Organization Not Found.')
    }

    const { id: organizationId } = user.organization

    const estimates = await this.prisma.estimate.findMany({
      where: {
        organizationId,
      },
    })

    return estimates
  }
}
