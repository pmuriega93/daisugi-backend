import { User } from "src/auth/entities/user.entity";
import { Client } from "src/clients/entities/client.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('audiences')
export class Audience {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    description: string;

    @Column('text', {
        array: true,
        default: ['enterprise']
    })
    type: string[];

    @ManyToMany(
        () => Client,
        (client) => client.audiences,
    )
    clients: Client[]

    
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