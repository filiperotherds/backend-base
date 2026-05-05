import { Module } from '@nestjs/common'
import { ProfessionalService } from './professional.service'
import { GetCompletedJobsTodayController } from './controllers/get-completed-jobs-today.controller'
import { PrismaService } from '@/database/prisma/prisma.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Module({
  controllers: [GetCompletedJobsTodayController],
  providers: [ProfessionalService, PrismaService, JwtAuthGuard],
  exports: [ProfessionalService],
})
export class ProfessionalModule {}
