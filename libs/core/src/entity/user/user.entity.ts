import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';

@Entity()
export class User extends BaseEntity {
  @Property({ type: 'uuid' })
  uuid!: string;

  @Property({ type: 'varchar', length: 15 })
  phoneNumber!: string;

  @Property({ type: 'varchar', length: 100 })
  nickname!: string;

  constructor(uuid: string, phoneNumber: string, nickname: string) {
    super();
    this.uuid = uuid;
    this.phoneNumber = phoneNumber;
    this.nickname = nickname;
  }
}
