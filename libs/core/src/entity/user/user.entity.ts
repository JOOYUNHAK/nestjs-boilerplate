import { Entity, Enum, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../base.entity';
import { AuthProvider } from './auth-provider.enum';

@Entity()
export class User extends BaseEntity {
  @Property({ type: 'uuid' })
  uuid!: string;

  @Property({ type: 'varchar', length: 15, nullable: true })
  phoneNumber?: string;

  @Property({ type: 'varchar', length: 100 })
  nickname!: string;

  @Property({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Exclude()
  @Property({ type: 'varchar', length: 255, nullable: true, hidden: true })
  password?: string;

  @Property({ type: 'varchar', length: 100, nullable: true, unique: true })
  naverId?: string;

  @Enum({ items: () => AuthProvider, type: 'string' })
  provider!: AuthProvider;

  constructor(
    uuid: string,
    nickname: string,
    provider: AuthProvider,
    phoneNumber?: string,
    email?: string,
    naverId?: string,
    password?: string,
  ) {
    super();
    this.uuid = uuid;
    this.nickname = nickname;
    this.provider = provider;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.naverId = naverId;
    this.password = password;
  }
}
