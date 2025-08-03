import { Inject, Injectable } from '@nestjs/common';
import { ApiRepository, ApiRepositoryToken } from './api.repository';
import { User } from '@libs/core/entity';
import { EMAIL_CLIENT, EmailService } from '@libs/core';

@Injectable()
export class ApiService {
  constructor(
    @Inject(ApiRepositoryToken)
    private readonly apiRepository: ApiRepository,
    @Inject(EMAIL_CLIENT)
    private readonly emailService: EmailService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  debugSentry() {
    throw new Error('Unexpected error to test sentry integration');
  }

  async execute(id: number): Promise<User | null> {
    return this.apiRepository.findById(id);
  }

  async debugEmail(): Promise<void> {
    await this.emailService.send({
      to: ['wndbsgkr@gmail.com'],
      subject: 'Test Email',
      html: '<p>Hello Test</p>',
    });
  }
}
