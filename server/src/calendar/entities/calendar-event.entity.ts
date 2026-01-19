import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from '../../database/entities/user.entity';

@Entity('calendar_events')
export class CalendarEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ length: 255 })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'start_date', type: 'timestamp' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'timestamp', nullable: true })
    endDate: Date;

    @Column({ default: false, name: 'all_day' })
    allDay: boolean;

    @Column({ name: 'type', length: 50, nullable: true })
    tag: string; // "event", "task", "reminder", "holiday"

    @Column({ length: 50, nullable: true })
    color: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne('User', (user: any) => user.calendarEvents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
