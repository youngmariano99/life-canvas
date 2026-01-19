import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from '../../database/entities/user.entity';
import type { Goal } from '../../goals/entities/goal.entity';

@Entity('deviations')
export class Deviation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'goal_id', nullable: true })
    goalId: string;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 255, nullable: true })
    reason: string;

    @Column({ length: 255, nullable: true })
    correction: string;

    @Column({ name: 'date', type: 'date' })
    date: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', (user: any) => user.deviations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne('Goal', (goal: any) => goal.deviations, { nullable: true })
    @JoinColumn({ name: 'goal_id' })
    goal: Goal;
}
