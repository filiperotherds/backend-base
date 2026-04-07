import { PrismaService } from '@/database/prisma/prisma.service'
import {
  ConflictException,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignInBodySchema } from './schemas/sign-in.schema'
import { compare, hash } from 'bcryptjs'
import { CurrentUser } from '@/common/decorators/current-user-decorator'
import { TokenPayload } from './strategies/jwt.strategy'
import { MailService } from '@/common/services/mail/mail.service'
import { VerifyEmailBodySchema } from './schemas/verify-email.schema'
import { SignUpBodySchema } from './schemas/sign-up.schema'
import { ResendVerificationBodySchema } from './schemas/resend-verification.schema'
import { CompleteOnboardingBodySchema } from './schemas/complete-onboarding.schema'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailService: MailService,
  ) {}

  async signin({ email, password }: SignInBodySchema) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.')
    }

    const payload = {
      sub: user.id,
      iss: 'jobble.auth',
      data: {
        is_verified: user.isVerified,
        onboarding_completed: user.onboardingCompleted,
      },
    }

    const accessToken = await this.jwt.signAsync(payload)

    return {
      access_token: accessToken,
    }
  }

  async signup({ email, password }: SignUpBodySchema) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (userExists) {
      throw new ConflictException('User already exists.')
    }

    const hashedPassword = await hash(password, 8)
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString()

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })

      await tx.professionalProfile.create({
        data: {
          userId: user.id,
        },
      })

      await tx.token.create({
        data: {
          userId: user.id,
          type: 'EMAIL_VERIFICATION',
          code: verificationCode,
        },
      })

      await this.mailService.sendVerificationEmail(email, verificationCode)
    })
  }

  async verifyEmail({ email, code }: VerifyEmailBodySchema) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        tokens: {
          where: {
            type: 'EMAIL_VERIFICATION',
            code,
          },
        },
      },
    })

    if (!user) {
      throw new BadRequestException('Usuário não encontrado.')
    }

    if (user.tokens.length === 0) {
      throw new BadRequestException('Código de verificação inválido.')
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      })

      await tx.token.deleteMany({
        where: {
          userId: user.id,
          type: 'EMAIL_VERIFICATION',
        },
      })
    })
  }

  async resendVerification({ email }: ResendVerificationBodySchema) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new BadRequestException('Usuário não encontrado.')
    }

    if (user.isVerified) {
      throw new BadRequestException('Usuário já verificado.')
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString()

    await this.prisma.$transaction(async (tx) => {
      await tx.token.deleteMany({
        where: {
          userId: user.id,
          type: 'EMAIL_VERIFICATION',
        },
      })

      await tx.token.create({
        data: {
          userId: user.id,
          type: 'EMAIL_VERIFICATION',
          code: verificationCode,
        },
      })

      await this.mailService.sendVerificationEmail(email, verificationCode)
    })
  }

  async completeOnboarding(
    userId: string,
    { name, cpf }: CompleteOnboardingBodySchema,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new BadRequestException('Usuário não encontrado.')
    }

    if (user.onboardingCompleted) {
      throw new BadRequestException('Onboarding já realizado.')
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        cpf,
        onboardingCompleted: true,
      },
    })

    const payload = {
      sub: updatedUser.id,
      iss: 'jobble.auth',
      data: {
        is_verified: updatedUser.isVerified,
        onboarding_completed: updatedUser.onboardingCompleted,
      },
    }

    const accessToken = await this.jwt.signAsync(payload)

    return {
      access_token: accessToken,
    }
  }
}
