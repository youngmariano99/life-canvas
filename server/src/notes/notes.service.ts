import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { NoteFolder } from './entities/note-folder.entity';
import { NoteTag } from './entities/note-tag.entity';
import { CreateNoteDto, CreateNoteFolderDto } from './dto/create-note.dto';
import { UpdateNoteDto, UpdateNoteFolderDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Note)
        private noteRepository: Repository<Note>,
        @InjectRepository(NoteFolder)
        private folderRepository: Repository<NoteFolder>,
        @InjectRepository(NoteTag)
        private tagRepository: Repository<NoteTag>,
    ) { }

    // --- Folders ---

    async findAllFolders(userId: string) {
        return this.folderRepository.find({
            where: { user: { id: userId } },
            order: { name: 'ASC' }
        });
    }

    async createFolder(createDto: CreateNoteFolderDto, userId: string) {
        const folder = this.folderRepository.create({
            ...createDto,
            user: { id: userId } as any,
            parent: createDto.parentId ? { id: createDto.parentId } as any : null
        });
        return this.folderRepository.save(folder);
    }

    async updateFolder(id: string, updateDto: UpdateNoteFolderDto, userId: string) {
        const folder = await this.folderRepository.findOne({ where: { id, user: { id: userId } } });
        if (!folder) throw new Error(`Folder ${id} not found`);

        await this.folderRepository.update(id, updateDto);
        return this.folderRepository.findOneBy({ id });
    }

    async removeFolder(id: string, userId: string) {
        const result = await this.folderRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }

    // --- Notes ---

    async findAllNotes(userId: string) {
        // Fetch all notes for the user, regardless of folder
        return this.noteRepository.find({
            where: { user: { id: userId } },
            order: { updatedAt: 'DESC' },
            relations: ['tags', 'folder']
        });
    }

    async createNote(createDto: CreateNoteDto, userId: string) {
        // Handle tags (assuming tags is string[] in DTO, but we need NoteTag entities)
        // For simplicity, we'll ignore tags for now or treating them as needing full implementation later

        const note = this.noteRepository.create({
            title: createDto.title,
            type: createDto.type || 'note',
            content: createDto.content,
            isFavorite: createDto.isFavorite,
            folder: createDto.folderId ? { id: createDto.folderId } as any : null,
            user: { id: userId } as any
        });

        return this.noteRepository.save(note);
    }

    async updateNote(id: string, updateDto: UpdateNoteDto, userId: string) {
        const note = await this.noteRepository.findOne({ where: { id, user: { id: userId } } });
        if (!note) throw new Error(`Note ${id} not found`);

        const { tags, ...data } = updateDto as any; // Ignore tags for simple update
        await this.noteRepository.update(id, data);
        return this.noteRepository.findOne({
            where: { id },
            relations: ['tags', 'folder']
        });
    }

    async removeNote(id: string, userId: string) {
        const result = await this.noteRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
}
