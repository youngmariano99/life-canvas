import { NotesService } from './notes.service';
import { CreateNoteDto, CreateNoteFolderDto } from './dto/create-note.dto';
import { UpdateNoteDto, UpdateNoteFolderDto } from './dto/update-note.dto';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    findAllFolders(req: any): Promise<import("./entities/note-folder.entity").NoteFolder[]>;
    createFolder(createDto: CreateNoteFolderDto, req: any): Promise<import("./entities/note-folder.entity").NoteFolder>;
    updateFolder(id: string, updateDto: UpdateNoteFolderDto, req: any): Promise<import("./entities/note-folder.entity").NoteFolder | null>;
    removeFolder(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
    findAllNotes(req: any): Promise<import("./entities/note.entity").Note[]>;
    createNote(createDto: CreateNoteDto, req: any): Promise<import("./entities/note.entity").Note>;
    updateNote(id: string, updateDto: UpdateNoteDto, req: any): Promise<import("./entities/note.entity").Note | null>;
    removeNote(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
