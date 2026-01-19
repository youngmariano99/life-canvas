import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import type { Habit } from '../../habits/entities/habit.entity';

@Entity('habit_logs')
@Unique(['habitId', 'date'])
export class HabitLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'habit_id' })
    habitId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ default: 'completed', length: 20, nullable: true })
    status: string;

    @Column({ type: 'text', nullable: true })
    note: string;

    @ManyToOne('Habit', (habit: any) => habit.logs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'habit_id' })
    habit: Habit;
}
