import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('mails')
export class Mail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    subject: string;

    @Column('text')
    html: string;

    @Column('text', {
        default: null,
    })
    scheduledAt: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;
    
    @ManyToOne(
        () => User,
        (user) => user.mails,
        { eager: true }
    )
    user: User;
    
}