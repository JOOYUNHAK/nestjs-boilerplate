import { User } from '@libs/core/entity';
import { EntityData } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

export const defaultUserData = (): EntityData<User> => ({
  uuid: randomUUID(),
  phoneNumber: '01000000000',
  nickname: 'testUser',
});
