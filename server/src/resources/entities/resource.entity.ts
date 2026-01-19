import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Goal } from '../../goals/entities/goal.entity';

@Entity('resources')
export class Resource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'goal_id' })
    goalId: string;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 50 })
    type: string; // "link", "book", "video", "tool", "other"

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('Goal', (goal: any) => goal.resources, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'goal_id' })
    goal: Goal;
}
