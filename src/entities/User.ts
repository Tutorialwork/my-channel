import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {

    @Column({ unique: true, primary: true })
    id: string;

    @Column({ nullable: true, type: 'int' })
    code?: number | null;

    @Column({ nullable: true, type: 'varchar' })
    channelId?: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}