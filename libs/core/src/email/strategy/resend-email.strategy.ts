import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmailService } from '../email.service';
import { EmailPayload } from '../email.type';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ResendOptions } from '@libs/config';

@Injectable()
export class ResendEmailStrategy implements EmailService {
  private readonly resend: Resend;
  private readonly from: string;
  private readonly logger = new Logger(ResendEmailStrategy.name);

  constructor(configService: ConfigService) {
    const { apiKey, from } = configService.getOrThrow<ResendOptions>('resend');
    this.resend = new Resend(apiKey);
    this.from = from;
  }

  async send(payload: EmailPayload): Promise<void> {
    try {
      await this.resend.emails.send({
        from: payload.from ?? this.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });
    } catch (error) {
      this.logger.error('Failed to send email via Resend API', {
        err: error,
        payload,
      });

      throw new InternalServerErrorException(
        'Failed to send email via Resend API',
      );
    }
  }

  async sendBatch(payloads: EmailPayload[]): Promise<void> {
    try {
      const emails = payloads.map(payload => ({
        from: payload.from ?? this.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }));
      await this.resend.batch.send(emails);
    } catch (error) {
      this.logger.error('Failed to send batch emails via Resend API', {
        err: error,
        payloads,
      });

      throw new InternalServerErrorException(
        'Failed to send batch emails via Resend API',
      );
    }
  }
}
