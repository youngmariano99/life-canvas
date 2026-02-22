import type { User } from '../../database/entities/user.entity';
import type { Note } from './note.entity';
export declare class NoteTag {
    id: string;
    userId: string;
    name: string;
    color: string;
    type: 'role' | 'goal' | 'project' | 'custom';
    referenceId: string;
    createdAt: Date;
    user: User;
    notes: Note[];
}
