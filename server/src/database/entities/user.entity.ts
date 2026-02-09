import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { Role } from '../../roles/entities/role.entity';
import type { Goal } from '../../goals/entities/goal.entity';
import type { Habit } from '../../habits/entities/habit.entity';
import type { Deviation } from '../../deviations/entities/deviation.entity';
import type { NoteFolder } from '../../notes/entities/note-folder.entity';
import type { Note } from '../../notes/entities/note.entity';
import type { NoteTag } from '../../notes/entities/note-tag.entity';
import type { DailyStone } from '../../daily-stones/entities/daily-stone.entity';
import type { FitnessActivity } from '../../fitness/entities/fitness-activity.entity';
import type { CalendarEvent } from '../../calendar/entities/calendar-event.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    name: string;

    @Column({ select: false, nullable: true })
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany('Role', (role: any) => role.user)
    roles: Role[];

    @OneToMany('Goal', (goal: any) => goal.user)
    goals: Goal[];

    @OneToMany('Habit', (habit: any) => habit.user)
    habits: Habit[];

    @OneToMany('Deviation', (deviation: any) => deviation.user)
    deviations: Deviation[];

    @OneToMany('NoteFolder', (folder: any) => folder.user)
    noteFolders: NoteFolder[];

    @OneToMany('Note', (note: any) => note.user)
    notes: Note[];

    @OneToMany('NoteTag', (tag: any) => tag.user)
    noteTags: NoteTag[];

    @OneToMany('DailyStone', (dailyStone: any) => dailyStone.user)
    dailyStones: DailyStone[];

    @OneToMany('FitnessActivity', (fitness: any) => fitness.user)
    fitnessActivities: FitnessActivity[];

    @OneToMany('CalendarEvent', (event: any) => event.user)
    calendarEvents: CalendarEvent[];
}
