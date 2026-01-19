import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import type { User } from '../../database/entities/user.entity';
import type { NoteFolder } from './note-folder.entity';
import type { NoteTag } from './note-tag.entity';

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'folder_id', nullable: true })
    folderId: string;

    @Column({ length: 50, default: 'note' })
    type: string; // "note", "whiteboard", "document"

    @Column({ length: 255 })
    title: string;

    @Column('text', { nullable: true })
    content: string;

    @Column({ default: false })
    isFavorite: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne('User', (user: any) => user.notes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne('NoteFolder', (folder: any) => folder.notes, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'folder_id' })
    folder: NoteFolder;

    @ManyToMany('NoteTag', (tag: any) => tag.notes)
    @JoinTable({
        name: 'note_tags_notes_note',
        joinColumn: { name: 'noteId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'noteTagId', referencedColumnName: 'id' }
    })
    tags: NoteTag[];
}
