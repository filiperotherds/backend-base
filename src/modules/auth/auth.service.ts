import { PrismaService } from '@/database/prisma/prisma.service'
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignInBodySchema } from './schemas/sign-in.schema'
import { compare, hash } from 'bcryptjs'
import { SignUpBodySchema } from './schemas/sign-up.schema'
import { CurrentUser } from '@/common/decorators/current-user-decorator'
import { TokenPayload } from './strategies/jwt.strategy'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async singin({ email, password }: SignInBodySchema) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        member: {
          select: {
            organizationId: true,
          },
        },
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
      orgId: user.member?.organizationId,
      iss: 'workee.auth',
      data: {
        onboarding_completed: user.onboardingCompleted,
      },
    }

    const accessToken = await this.jwt.signAsync(payload)

    return {
      access_token: accessToken,
    }
  }

  async singup({ email, password }: SignUpBodySchema) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (userExists) {
      throw new ConflictException('User already exists.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })

      await tx.userProfile.create({
        data: {
          userId: user.id,
        },
      })
    })
  }

  async getUserMembership(@CurrentUser() { sub }: TokenPayload) {}
}
