import { PrismaService } from '@/database/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class EstimatesService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationEstimates(sub: string) {
    // Stub implementation: Estimate model was replaced in the new schema.
    // Returning an empty array ensures the build passes and the frontend doesn't break.
    return []
  }
}
