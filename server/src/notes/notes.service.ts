import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
        // Handle tags: frontend sends an array of tag IDs (string[])
        let tagEntities: NoteTag[] = [];
        if (createDto.tags && createDto.tags.length > 0) {
            // Fetch existing tags
            tagEntities = await this.tagRepository.findBy({ id: In(createDto.tags) });
            const foundIds = tagEntities.map(t => t.id);

            // For tags that don't exist (e.g. auto-generated "role-123"), create them on the fly
            const missingIds = createDto.tags.filter(id => !foundIds.includes(id));
            if (missingIds.length > 0) {
                const newTags = missingIds.map(id => {
                    const type = id.split('-')[0] as any;
                    const referenceId = id.split('-').slice(1).join('-');
                    return this.tagRepository.create({
                        id, // Use the custom ID from frontend
                        userId, // Link to current user
                        name: id, // Fallback name
                        color: 'bg-primary', // Fallback color
                        type: ['role', 'goal', 'project'].includes(type) ? type : 'custom',
                        referenceId: referenceId || undefined
                    });
                });
                const savedTags = await this.tagRepository.save(newTags);
                tagEntities = [...tagEntities, ...savedTags];
            }
        }

        const note = this.noteRepository.create({
            title: createDto.title,
            type: createDto.type || 'note',
            content: createDto.content,
            isFavorite: createDto.isFavorite,
            folder: createDto.folderId ? { id: createDto.folderId } as any : null,
            user: { id: userId } as any,
            tags: tagEntities
        });

        const savedNote = await this.noteRepository.save(note);
        return { ...savedNote, tags: savedNote.tags || [] };
    }

    async updateNote(id: string, updateDto: UpdateNoteDto, userId: string) {
        const note = await this.noteRepository.findOne({ where: { id, user: { id: userId } } });
        if (!note) throw new Error(`Note ${id} not found`);

        const { tags, ...data } = updateDto as any;

        // Update basic data
        await this.noteRepository.update(id, data);

        // Update tags if provided
        if (tags !== undefined) {
            let tagEntities: NoteTag[] = [];
            if (tags && tags.length > 0) {
                tagEntities = await this.tagRepository.findBy({ id: In(tags) });
                const foundIds = tagEntities.map(t => t.id);

                const missingIds = tags.filter((id: string) => !foundIds.includes(id));
                if (missingIds.length > 0) {
                    const newTags = missingIds.map((id: string) => {
                        const type = id.split('-')[0] as any;
                        const referenceId = id.split('-').slice(1).join('-');
                        return this.tagRepository.create({
                            id,
                            userId,
                            name: id,
                            color: 'bg-primary',
                            type: ['role', 'goal', 'project'].includes(type) ? type : 'custom',
                            referenceId: referenceId || undefined
                        });
                    });
                    const savedTags = await this.tagRepository.save(newTags);
                    tagEntities = [...tagEntities, ...savedTags];
                }
            }

            // To update ManyToMany relations, we must save the entity instance with the new tags array.
            // .update() does not handle ManyToMany relations.
            note.tags = tagEntities;
            await this.noteRepository.save(note);
        }
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
