import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from '../../database/entities/user.entity';

@Entity('fitness_activities')
export class FitnessActivity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ length: 255 })
    type: string; // e.g., "running", "gym", "yoga"

    @Column({ name: 'date', type: 'date' })
    date: Date;

    @Column({ type: 'int', nullable: true })
    duration: number; // in minutes

    @Column({ type: 'int', nullable: true })
    calories: number;

    @Column({ type: 'float', nullable: true })
    distance: number; // in km

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column('jsonb', { name: 'performance_snapshot', nullable: true })
    performanceSnapshot: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', (user: any) => user.fitnessActivities, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
