import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { NoteFolder } from './entities/note-folder.entity';
import { NoteTag } from './entities/note-tag.entity';
import { User } from '../database/entities/user.entity';
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
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    private async getDemoUser() {
        let user = await this.userRepository.findOne({ where: { email: 'demo@lifecanvas.com' } });
        if (!user) {
            user = this.userRepository.create({
                email: 'demo@lifecanvas.com',
                name: 'Demo User',
            });
            await this.userRepository.save(user);
        }
        return user;
    }

    // --- Folders ---

    async findAllFolders() {
        const user = await this.getDemoUser();
        return this.folderRepository.find({
            where: { user: { id: user.id } },
            order: { name: 'ASC' }
        });
    }

    async createFolder(createDto: CreateNoteFolderDto) {
        const user = await this.getDemoUser();
        const folder = this.folderRepository.create({
            ...createDto,
            user,
            parent: createDto.parentId ? { id: createDto.parentId } as any : null
        });
        return this.folderRepository.save(folder);
    }

    async updateFolder(id: string, updateDto: UpdateNoteFolderDto) {
        await this.folderRepository.update(id, updateDto);
        return this.folderRepository.findOneBy({ id });
    }

    async removeFolder(id: string) {
        await this.folderRepository.delete(id);
        return { deleted: true };
    }

    // --- Notes ---

    async findAllNotes() {
        // Fetch all notes for the user, regardless of folder
        const user = await this.getDemoUser();
        return this.noteRepository.find({
            where: { user: { id: user.id } },
            order: { updatedAt: 'DESC' },
            relations: ['tags', 'folder']
        });
    }

    async createNote(createDto: CreateNoteDto) {
        const user = await this.getDemoUser();

        // Handle tags (assuming tags is string[] in DTO, but we need NoteTag entities)
        // For simplicity, we'll ignore tags for now or treating them as needing full implementation later

        const note = this.noteRepository.create({
            title: createDto.title,
            type: createDto.type || 'note',
            content: createDto.content,
            isFavorite: createDto.isFavorite,
            folder: createDto.folderId ? { id: createDto.folderId } as any : null,
            user
        });

        return this.noteRepository.save(note);
    }

    async updateNote(id: string, updateDto: UpdateNoteDto) {
        const { tags, ...data } = updateDto as any; // Ignore tags for simple update
        await this.noteRepository.update(id, data);
        return this.noteRepository.findOne({
            where: { id },
            relations: ['tags', 'folder']
        });
    }

    async removeNote(id: string) {
        await this.noteRepository.delete(id);
        return { deleted: true };
    }
}
