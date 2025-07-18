import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export class BaseEntity {
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
  updatedAt?: Date;

  @Property({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;
}
