import { Controller, Get, UseGuards } from '@nestjs/common'
import { ProfessionalService } from '../professional.service'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { CurrentUser } from '@/common/decorators/current-user-decorator'
import { TokenPayload } from '@/modules/auth/strategies/jwt.strategy'

@Controller('/professional/jobs')
@UseGuards(JwtAuthGuard)
export class GetCompletedJobsTodayController {
  constructor(private professionalService: ProfessionalService) {}

  @Get('completed-today')
  async handle(@CurrentUser() { sub }: TokenPayload) {
    const { jobs, totalEarnings } =
      await this.professionalService.getCompletedJobsToday(sub)

    return {
      jobs,
      totalEarnings,
    }
  }
}
