import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { Env } from '@/config/env'

@Injectable()
export class MailService {
  private resend: Resend

  constructor(private configService: ConfigService<Env, true>) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'))
  }

  async sendVerificationEmail(email: string, code: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev', // Ensure the user has a verified domain or use this default for testing
      to: email,
      subject: 'Verifique seu e-mail',
      html: `<p>Seu código de verificação é: <strong>${code}</strong></p>`,
    })
  }
}
