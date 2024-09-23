import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('reset-token')
export class ResetToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('timestamp')
    expiryDate: Date;

    @Column('text')
    token: string;

    @Column('uuid')
    userId: string;
}
