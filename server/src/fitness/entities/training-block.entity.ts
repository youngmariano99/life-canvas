import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from '../../database/entities/user.entity';

@Entity('training_blocks')
export class TrainingBlock {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'duration_weeks', type: 'int', default: 4 })
    durationWeeks: number;

    @Column({ name: 'is_active', type: 'boolean', default: false })
    isActive: boolean;

    @Column('jsonb', { default: [] })
    routines: any[]; // Array of BlockRoutineProgression

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', (user: any) => user.trainingBlocks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
