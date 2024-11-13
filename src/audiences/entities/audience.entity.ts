import { User } from "src/auth/entities/user.entity";
import { Client } from "src/clients/entities/client.entity";
import { Group } from "src/audiences/entities/group.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('audiences')
export class Audience {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    description: string;

    @Column('text', {
        default: 'empresa'
    })
    type: string;

    @Column('bool', {
      default: true,
    })
    isActive: boolean;

    @ManyToMany(
        () => Client,
        (client) => client.audiences,
    )
    clients: Client[]

    @OneToMany(
      () => Group,
      (group) => group.audience,
    )
    groups: Group[];

    
    @ManyToOne(
        () => User,
        (user) => user.audience,
        { eager: true }
    )
    user: User;

    
  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.description = this.description.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }

}
