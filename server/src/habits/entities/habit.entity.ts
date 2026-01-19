import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import type { User } from '../../database/entities/user.entity';
import type { Role } from '../../roles/entities/role.entity';
import type { HabitLog } from '../../habit-logs/entities/habit-log.entity';

@Entity('habits')
export class Habit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'role_id', nullable: true })
    roleId: string;

    @Column({ length: 255 })
    name: string;

    @Column({ default: 'daily', length: 20, nullable: true })
    frequency: string;

    @Column('smallint', { array: true, default: [], name: 'custom_days' })
    customDays: number[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', (user: any) => user.habits, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne('Role', (role: any) => role.habits)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToMany('HabitLog', (log: any) => log.habit)
    logs: HabitLog[];
}
