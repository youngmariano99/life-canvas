import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import type { User } from '../../database/entities/user.entity';
import type { Note } from './note.entity';

@Entity('note_tags')
export class NoteTag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 20, default: '#808080' })
    color: string;

    @Column({ type: 'varchar', length: 20, default: 'custom' })
    type: 'role' | 'goal' | 'project' | 'custom';

    @Column({ name: 'reference_id', nullable: true })
    referenceId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', (user: any) => user.noteTags, { onDelete: 'CASCADE' }) // Fixed: Added inverse relation
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToMany('Note', (note: any) => note.tags)
    notes: Note[];
}
