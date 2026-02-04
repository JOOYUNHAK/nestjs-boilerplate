import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApiRepository, ApiRepositoryToken } from './api.repository';
import { User } from '@libs/core/entity';
import { EMAIL_CLIENT, EmailService } from '@libs/core';
import * as inspector from 'inspector';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ApiService {
  private session: inspector.Session | null = null;
  private readonly logger = new Logger(ApiService.name);

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

  async startCpuProfile(): Promise<string> {
    if (this.session) {
      throw new Error('Profiling is already in progress');
    }

    this.session = new inspector.Session();
    this.session.connect();

    return new Promise((resolve, reject) => {
      this.session?.post('Profiler.enable', err => {
        if (err) return reject(err);
        this.session?.post('Profiler.start', err => {
          if (err) return reject(err);
          this.logger.log('CPU Profiling started');
          resolve('CPU Profiling started');
        });
      });
    });
  }

  async stopCpuProfile(): Promise<string> {
    if (!this.session) {
      throw new Error('No profiling session active');
    }

    return new Promise((resolve, reject) => {
      this.session?.post('Profiler.stop', (err, params) => {
        if (err) return reject(err);

        const { profile } = params;
        const profileName = `cpu-profile-${new Date().toISOString().replace(/:/g, '-')}.cpuprofile`;
        const profilePath = path.join(process.cwd(), profileName);

        fs.writeFileSync(profilePath, JSON.stringify(profile));

        this.session?.disconnect();
        this.session = null;

        this.logger.log(`CPU Profiling stopped. Saved to ${profilePath}`);
        resolve(profilePath);
      });
    });
  }
}
