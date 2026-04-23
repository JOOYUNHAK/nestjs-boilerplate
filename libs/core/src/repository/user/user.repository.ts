import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { AuthProvider } from '../../entity/user/auth-provider.enum';
import { User } from '../../entity/user/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly em: EntityManager) {}

  async findByNaverId(naverId: string): Promise<User | null> {
    return this.em.findOne(User, { naverId });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }

  async create(
    uuid: string,
    nickname: string,
    provider: AuthProvider,
    options?: {
      phoneNumber?: string;
      email?: string;
      naverId?: string;
      password?: string;
    },
  ): Promise<User> {
    const user = new User(
      uuid,
      nickname,
      provider,
      options?.phoneNumber,
      options?.email,
      options?.naverId,
      options?.password,
    );
    await this.em.persistAndFlush(user);
    return user;
  }

  async save(user: User): Promise<User> {
    await this.em.persistAndFlush(user);
    return user;
  }
}
