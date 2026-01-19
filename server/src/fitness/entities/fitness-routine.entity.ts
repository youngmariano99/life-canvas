import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from '../../database/entities/user.entity';

@Entity('fitness_routines')
export class FitnessRoutine {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 50 })
    type: string; // 'strength', 'cardio', 'hybrid'

    @Column({ name: 'structure_type', length: 50 })
    structureType: string; // 'sets_reps', 'intervals', 'rounds', 'time', 'distance'

    @Column({ nullable: true })
    rounds: string;

    @Column('jsonb', { default: [] })
    content: any; // Flexible JSON structure for exercises

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', (user: any) => user.fitnessRoutines, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
