import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProfessionalService {
  constructor(private prisma: PrismaService) {}

  async getCompletedJobsToday(userId: string) {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const completedJobs = await this.prisma.serviceRequest.findMany({
      where: {
        status: 'COMPLETED',
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        professionalMatches: {
          some: {
            status: 'ACCEPTED',
            professional: {
              userId,
            },
          },
        },
      },
      include: {
        address: true,
        client: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        professionalMatches: {
          where: {
            status: 'ACCEPTED',
            professional: {
              userId,
            },
          },
          select: {
            bidValue: true,
            proposedDate: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const totalEarnings = completedJobs.reduce((sum, job) => {
      const bid = job.professionalMatches[0]?.bidValue || 0
      return sum + bid
    }, 0)

    return {
      jobs: completedJobs,
      totalEarnings,
    }
  }
}
