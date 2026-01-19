import { NotesService } from './notes.service';
import { CreateNoteDto, CreateNoteFolderDto } from './dto/create-note.dto';
import { UpdateNoteDto, UpdateNoteFolderDto } from './dto/update-note.dto';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    findAllFolders(): Promise<import("./entities/note-folder.entity").NoteFolder[]>;
    createFolder(createDto: CreateNoteFolderDto): Promise<import("./entities/note-folder.entity").NoteFolder>;
    updateFolder(id: string, updateDto: UpdateNoteFolderDto): Promise<import("./entities/note-folder.entity").NoteFolder | null>;
    removeFolder(id: string): Promise<{
        deleted: boolean;
    }>;
    findAllNotes(): Promise<import("./entities/note.entity").Note[]>;
    createNote(createDto: CreateNoteDto): Promise<import("./entities/note.entity").Note>;
    updateNote(id: string, updateDto: UpdateNoteDto): Promise<import("./entities/note.entity").Note | null>;
    removeNote(id: string): Promise<{
        deleted: boolean;
    }>;
}
