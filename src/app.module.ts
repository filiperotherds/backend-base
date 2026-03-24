import { Module } from '@nestjs/common'
import { PrismaService } from './database/prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './config/env'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { OrganizationsModule } from './modules/organizations/organizations.module'
import { EstimatesModule } from './modules/estimates/estimates.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    EstimatesModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
