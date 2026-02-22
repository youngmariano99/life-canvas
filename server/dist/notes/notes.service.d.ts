import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { NoteFolder } from './entities/note-folder.entity';
import { NoteTag } from './entities/note-tag.entity';
import { CreateNoteDto, CreateNoteFolderDto } from './dto/create-note.dto';
import { UpdateNoteDto, UpdateNoteFolderDto } from './dto/update-note.dto';
export declare class NotesService {
    private noteRepository;
    private folderRepository;
    private tagRepository;
    constructor(noteRepository: Repository<Note>, folderRepository: Repository<NoteFolder>, tagRepository: Repository<NoteTag>);
    findAllFolders(userId: string): Promise<NoteFolder[]>;
    createFolder(createDto: CreateNoteFolderDto, userId: string): Promise<NoteFolder>;
    updateFolder(id: string, updateDto: UpdateNoteFolderDto, userId: string): Promise<NoteFolder | null>;
    removeFolder(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    findAllNotes(userId: string): Promise<Note[]>;
    createNote(createDto: CreateNoteDto, userId: string): Promise<{
        tags: NoteTag[];
        id: string;
        userId: string;
        folderId: string;
        type: string;
        title: string;
        content: string;
        isFavorite: boolean;
        createdAt: Date;
        updatedAt: Date;
        user: import("../database/entities/user.entity").User;
        folder: NoteFolder;
    }>;
    updateNote(id: string, updateDto: UpdateNoteDto, userId: string): Promise<Note | null>;
    removeNote(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
