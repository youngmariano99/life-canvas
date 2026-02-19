import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { ActivePauseRoutineEntity } from './active-pause-routine.entity';

@Entity('active_pause_entries')
export class ActivePauseEntryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column()
    routineId: string;

    @ManyToOne(() => ActivePauseRoutineEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'routineId' })
    routine: ActivePauseRoutineEntity;

    @Column({ default: false })
    completed: boolean;

    @Column({ default: false })
    waterIntake: boolean;

    @Column({ default: false })
    eyeCare: boolean;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;
}
