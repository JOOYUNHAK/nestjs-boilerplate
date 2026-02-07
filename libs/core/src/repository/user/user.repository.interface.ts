import { AuthProvider, User } from '../../entity/user/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findByNaverId(naverId: string): Promise<User | null>;
  create(
    uuid: string,
    nickname: string,
    provider: AuthProvider,
    options?: {
      phoneNumber?: string;
      email?: string;
      naverId?: string;
    },
  ): Promise<User>;
  save(user: User): Promise<User>;
}
