import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import type { User } from '../../database/entities/user.entity';
import type { Note } from './note.entity';

@Entity('note_folders')
export class NoteFolder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'parent_id', nullable: true })
    parentId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('User', (user: any) => user.noteFolders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne('NoteFolder', (folder: any) => folder.children, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent: NoteFolder;

    @OneToMany('NoteFolder', (folder: any) => folder.parent)
    children: NoteFolder[];

    @OneToMany('Note', (note: any) => note.folder)
    notes: Note[];
}

