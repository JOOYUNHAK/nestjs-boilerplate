import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserFactory } from '../factories/user.factory';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    void new UserFactory(em).create(10);
  }
}
