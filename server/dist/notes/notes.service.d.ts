import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { NoteFolder } from './entities/note-folder.entity';
import { NoteTag } from './entities/note-tag.entity';
import { User } from '../database/entities/user.entity';
import { CreateNoteDto, CreateNoteFolderDto } from './dto/create-note.dto';
import { UpdateNoteDto, UpdateNoteFolderDto } from './dto/update-note.dto';
export declare class NotesService {
    private noteRepository;
    private folderRepository;
    private tagRepository;
    private userRepository;
    constructor(noteRepository: Repository<Note>, folderRepository: Repository<NoteFolder>, tagRepository: Repository<NoteTag>, userRepository: Repository<User>);
    private getDemoUser;
    findAllFolders(): Promise<NoteFolder[]>;
    createFolder(createDto: CreateNoteFolderDto): Promise<NoteFolder>;
    updateFolder(id: string, updateDto: UpdateNoteFolderDto): Promise<NoteFolder | null>;
    removeFolder(id: string): Promise<{
        deleted: boolean;
    }>;
    findAllNotes(): Promise<Note[]>;
    createNote(createDto: CreateNoteDto): Promise<Note>;
    updateNote(id: string, updateDto: UpdateNoteDto): Promise<Note | null>;
    removeNote(id: string): Promise<{
        deleted: boolean;
    }>;
}
