import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from '../../database/entities/user.entity';

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 50 })
    category: string; // 'Fuerza' | 'Cardio' | 'Flexibilidad'

    @Column('jsonb', { nullable: true })
    records: {
        maxWeight?: number;
        maxReps?: number;
        maxVolume?: number;
    };

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', (user: any) => user.exercises, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
