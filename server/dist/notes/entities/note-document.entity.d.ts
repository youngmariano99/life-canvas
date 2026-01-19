import type { User } from '../../database/entities/user.entity';
import type { Note } from './note.entity';
export declare class NoteDocument {
    id: string;
    userId: string;
    noteId: string;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    createdAt: Date;
    user: User;
    note: Note;
}
