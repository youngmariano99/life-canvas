import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Goal } from '../../goals/entities/goal.entity';

@Entity('resources')
export class Resource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'goal_id' })
    goalId: string;

    @Column({ length: 255 })
    name: string;

    @Column({ type: 'smallint', default: 2026 })
    year: number;

    @Column({ name: 'quantity_have', type: 'numeric', default: 0 })
    quantityHave: number;

    @Column({ name: 'quantity_needed', type: 'numeric', default: 0 })
    quantityNeeded: number;

    @Column({ length: 50, nullable: true })
    unit: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('Goal', (goal: any) => goal.resources, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'goal_id' })
    goal: Goal;
}
