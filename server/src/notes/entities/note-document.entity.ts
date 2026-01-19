import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from '../../database/entities/user.entity';
import type { Note } from './note.entity';

@Entity('note_documents')
export class NoteDocument {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'note_id' })
    noteId: string;

    @Column({ length: 255 })
    filename: string;

    @Column({ length: 255 })
    path: string;

    @Column({ length: 100 })
    mimetype: string;

    @Column()
    size: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne('Note', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'note_id' })
    note: Note;
}
