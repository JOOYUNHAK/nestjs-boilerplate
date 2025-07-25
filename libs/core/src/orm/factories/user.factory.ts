import { User } from '@libs/core/entity';
import { defaultUserData } from '@libs/testing';
import { EntityData } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';

export class UserFactory extends Factory<User> {
  model = User;

  protected definition(input?: EntityData<User>): EntityData<User> {
    return {
      ...defaultUserData(),
      ...input,
    };
  }
}
