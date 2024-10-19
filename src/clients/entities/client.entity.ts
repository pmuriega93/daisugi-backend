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
    () => Audience,
    (audience) => audience.clients,
    { eager: true, cascade: true }
  )
  audiences: Audience[]


  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
