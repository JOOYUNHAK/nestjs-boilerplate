import { User } from '@libs/core/entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

export const ApiRepositoryToken = Symbol('ApiRepositoryToken');

export interface ApiRepository {
  findById(id: number): Promise<User | null>;
}

@Injectable()
export class ApiRepositoryImpl implements ApiRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }
}
