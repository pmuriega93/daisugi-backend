import { Audience } from 'src/audiences/entities/audience.entity';
import { User } from '../../auth/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from "src/audiences/entities/group.entity";
import { Type } from 'class-transformer';
@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  file: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    default: ''
  })
  phone: string;

  @Column('text')
  fullName: string;

  @Type(() => Date)
  @Column('text', {
    default: null
  })
  birthday: Date;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ManyToOne(
    () => User,
    (user) => user.client,
    { eager: true }
  )
  user: User;

  @JoinTable()
  @ManyToMany(
    () => Group,
    (group) => group.clients,
    { eager: true, cascade: true }
  )
  groups: Group[];

  @JoinTable()
  @ManyToMany(
    () => Audience,
    (audience) => audience.clients,
    { eager: true, cascade: true }
  )
  audiences: Audience[]

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.fullName = this.fullName.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
