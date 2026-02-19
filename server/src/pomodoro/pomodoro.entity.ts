
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../database/entities/user.entity';

export enum PomodoroMode {
    TIMER = 'timer',
    STOPWATCH = 'stopwatch',
}

@Entity('pomodoros')
export class Pomodoro {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: PomodoroMode,
        default: PomodoroMode.TIMER,
    })
    type: PomodoroMode;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({ type: 'int' }) // in minutes
    duration: number;

    @Column({ type: 'int', nullable: true }) // in minutes, only for timer mode
    plannedDuration: number;

    @Column({ type: 'text' })
    activityName: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    // Associations (Stored as IDs for simplicity with current architecture, or relations if strict)
    // Given the current architecture uses direct IDs in frontend for flexibility, we'll store IDs but also set up relations for integrity if possible.
    // Looking at other entities, we often store IDs or simple relations.
    // Let's store nullable UUIDs.

    @Column({ type: 'uuid', nullable: true })
    roleId: string;

    @Column({ type: 'uuid', nullable: true })
    projectId: string;

    @Column({ type: 'uuid', nullable: true })
    habitId: string;

    @Column({ type: 'uuid', nullable: true })
    goalId: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
