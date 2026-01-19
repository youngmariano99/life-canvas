import type { User } from '../../database/entities/user.entity';
import type { NoteFolder } from './note-folder.entity';
import type { NoteTag } from './note-tag.entity';
export declare class Note {
    id: string;
    userId: string;
    folderId: string;
    type: string;
    title: string;
    content: string;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    folder: NoteFolder;
    tags: NoteTag[];
}
