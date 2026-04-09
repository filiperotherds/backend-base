import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { AuthService } from './auth.service'
import {
  type SignInBodySchema,
  signInBodySchema,
} from './schemas/sign-in.schema'
import {
  type SignUpBodySchema,
  signUpBodySchema,
} from './schemas/sign-up.schema'
import {
  type VerifyEmailBodySchema,
  verifyEmailBodySchema,
} from './schemas/verify-email.schema'
import {
  type ResendVerificationBodySchema,
  resendVerificationBodySchema,
} from './schemas/resend-verification.schema'
import {
  type CompleteOnboardingBodySchema,
  completeOnboardingBodySchema,
} from './schemas/complete-onboarding.schema'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from '@/common/decorators/current-user-decorator'
import { TokenPayload } from './strategies/jwt.strategy'

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @UsePipes(new ZodValidationPipe(signInBodySchema))
  async signin(@Body() body: SignInBodySchema) {
    const result = await this.authService.signin(body)

    console.log('JWT Token:', result)

    return result
  }

  @Post('/signup')
  @UsePipes(new ZodValidationPipe(signUpBodySchema))
  async signup(@Body() body: SignUpBodySchema) {
    await this.authService.signup(body)
  }

  @Post('/verify')
  @UsePipes(new ZodValidationPipe(verifyEmailBodySchema))
  @HttpCode(204)
  async verify(@Body() body: VerifyEmailBodySchema) {
    await this.authService.verifyEmail(body)
  }

  @Post('/resend-verification')
  @UsePipes(new ZodValidationPipe(resendVerificationBodySchema))
  @HttpCode(204)
  async resendVerification(@Body() body: ResendVerificationBodySchema) {
    await this.authService.resendVerification(body)
  }

  @Post('/complete-onboarding')
  @UseGuards(JwtAuthGuard)
  async completeOnboarding(
    @CurrentUser() user: TokenPayload,
    @Body(new ZodValidationPipe(completeOnboardingBodySchema))
    body: CompleteOnboardingBodySchema,
  ) {
    const result = await this.authService.completeOnboarding(user.sub, body)

    return result
  }
}
