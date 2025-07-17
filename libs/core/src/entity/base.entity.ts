import {
  Entity,
  Opt,
  OptionalProps,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from '@mikro-orm/core';

@Entity({ abstract: true })
export class BaseEntity {
  [PrimaryKeyProp]?: 'id';
  [OptionalProps]?: 'updatedAt' | 'deletedAt';

  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({
    type: 'timestamptz',
    onCreate: () => new Date(),
  })
  createdAt!: Date;

  @Property({
    type: 'timestamptz',
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Opt<Date>;

  @Property({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Opt<Date>;
}
