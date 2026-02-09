import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Goal } from './goal.entity';

@Entity('sub_goals')
export class SubGoal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'goal_id' })
    goalId: string;

    @Column({ length: 255 })
    title: string;

    @Column({ default: false })
    completed: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne('Goal', (goal: any) => goal.subGoals, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'goal_id' })
    goal: Goal;
}
