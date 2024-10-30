import { Audience } from "src/audiences/entities/audience.entity";
import { User } from "src/auth/entities/user.entity";
import { Client } from "src/clients/entities/client.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('groups') 
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text', {
        unique: true,
    })
    description: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @ManyToOne(
        () => Audience,
        (audience) => audience.groups,
        { eager: true }
    )
    audience: Audience;

    @ManyToMany(
        () => Client,
        (client) => client.groups,
    )
    clients: Client[];

    @ManyToOne(
        () => User,
        (user) => user.group,
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
