import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import type { User } from '../../database/entities/user.entity';
import type { Goal } from '../../goals/entities/goal.entity';
import type { Habit } from '../../habits/entities/habit.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ length: 100 })
    name: string;

    @Column({ default: 'circle', length: 50, nullable: true })
    icon: string;

    @Column({ default: 'student', length: 50, nullable: true })
    color: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', (user: any) => user.roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany('Goal', (goal: any) => goal.role)
    goals: Goal[];

    @OneToMany('Habit', (habit: any) => habit.role)
    habits: Habit[];
}
