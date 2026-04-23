import { AuthProvider } from '../../entity/user/auth-provider.enum';
import { User } from '../../entity/user/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findByNaverId(naverId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(
    uuid: string,
    nickname: string,
    provider: AuthProvider,
    options?: {
      phoneNumber?: string;
      email?: string;
      naverId?: string;
      password?: string;
    },
  ): Promise<User>;
  save(user: User): Promise<User>;
}
