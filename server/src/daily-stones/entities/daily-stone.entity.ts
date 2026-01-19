import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import type { User } from '../../database/entities/user.entity';
import type { Role } from '../../roles/entities/role.entity';

@Entity('daily_stones')
@Unique(['userId', 'date'])
export class DailyStone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ length: 255 })
    title: string;

    @Column({ name: 'role_id', nullable: true })
    roleId: string | null;

    @Column({ default: false, nullable: true })
    completed: boolean;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @ManyToOne('User', (user: any) => user.dailyStones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne('Role', { nullable: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;
}
