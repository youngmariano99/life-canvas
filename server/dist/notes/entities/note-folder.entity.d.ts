import type { User } from '../../database/entities/user.entity';
import type { Note } from './note.entity';
export declare class NoteFolder {
    id: string;
    userId: string;
    name: string;
    parentId: string;
    createdAt: Date;
    user: User;
    parent: NoteFolder;
    children: NoteFolder[];
    notes: Note[];
}
