import { Audience } from 'src/audiences/entities/audience.entity';
import { Client } from '../../clients/entities/client.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Group } from 'src/audiences/entities/group.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Mail } from 'src/mailer/entities/mail.entity';


@Entity('users')
export class User {

  @ApiProperty({
    example: 'ea4485f7-87b0-41b1-b256-08e13d57a3dd',
    description: 'Id del usuario - es un uuid',
    uniqueItems: true
  })  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'test123@gmail.com',
    description: 'email del usuario',
    uniqueItems: true
  })  
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'Abc123__',
    description: 'Contraseña del usuario. Debe contener mayúsculas, minúsculas, números y caracteres especiales. Longitud mánima 6 caracteres, máxima 50.',
  })  
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    example: 'Juan Perez',
    description: 'Nombre y apellido del usuario',
  }) 
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: 'true',
    description: 'Determina si el usuario está activo o inactivo, utilizado para el borrado lógico.',
  }) 
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: '1167953233',
    description: 'Teléfono del usuario',
  })
  @Column('text')
  phone: string;

  @ApiProperty({
    example: ['user', 'admin', 'super-user'],
    description: 'Rol del usuario, utilizado para autorización.',
  }) 
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @ApiProperty()
  @OneToMany(
    () => Client,
    (client) => client.user
  )
  client: Client;

  @ApiProperty()
  @OneToMany(
    () => Audience,
    (audience) => audience.user
  )
  audience: Audience;

  @ApiProperty()
  @OneToMany(
    () => Group,
    (group) => group.user
  )
  group: Group;

  @ApiProperty()
  @OneToMany(
    () => Mail,
    (mail) => mail.user
  )
  mails: Mail;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
