import { Inject, Injectable } from '@nestjs/common';
import { ApiRepository, ApiRepositoryToken } from './api.repository';
import { User } from '@libs/core/entity';

@Injectable()
export class ApiService {
  constructor(
    @Inject(ApiRepositoryToken)
    private readonly apiRepository: ApiRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  debugSentry() {
    throw new Error('Unexpected error to test sentry integration');
  }

  async excute(id: number): Promise<User | null> {
    return this.apiRepository.findById(id);
  }
}
