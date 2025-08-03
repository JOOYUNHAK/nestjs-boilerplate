import { Injectable } from '@nestjs/common';
import { EmailService } from '../email.service';
import { EmailPayload } from '../email.type';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ResendOptions } from '@libs/config';

@Injectable()
export class ResendEmailStrategy implements EmailService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(configService: ConfigService) {
    const { apiKey, from } = configService.getOrThrow<ResendOptions>('resend');
    this.resend = new Resend(apiKey);
    this.from = from;
  }

  async send(payload: EmailPayload): Promise<void> {
    await this.resend.emails.send({
      from: payload.from ?? this.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
  }
}

export const RESEND_EMAIL_CLIENT = Symbol('RESEND_EMAIL_CLIENT');
