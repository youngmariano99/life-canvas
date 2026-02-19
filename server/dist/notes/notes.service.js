"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const note_entity_1 = require("./entities/note.entity");
const note_folder_entity_1 = require("./entities/note-folder.entity");
const note_tag_entity_1 = require("./entities/note-tag.entity");
let NotesService = class NotesService {
    noteRepository;
    folderRepository;
    tagRepository;
    constructor(noteRepository, folderRepository, tagRepository) {
        this.noteRepository = noteRepository;
        this.folderRepository = folderRepository;
        this.tagRepository = tagRepository;
    }
    async findAllFolders(userId) {
        return this.folderRepository.find({
            where: { user: { id: userId } },
            order: { name: 'ASC' }
        });
    }
    async createFolder(createDto, userId) {
        const folder = this.folderRepository.create({
            ...createDto,
            user: { id: userId },
            parent: createDto.parentId ? { id: createDto.parentId } : null
        });
        return this.folderRepository.save(folder);
    }
    async updateFolder(id, updateDto, userId) {
        const folder = await this.folderRepository.findOne({ where: { id, user: { id: userId } } });
        if (!folder)
            throw new Error(`Folder ${id} not found`);
        await this.folderRepository.update(id, updateDto);
        return this.folderRepository.findOneBy({ id });
    }
    async removeFolder(id, userId) {
        const result = await this.folderRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
    async findAllNotes(userId) {
        return this.noteRepository.find({
            where: { user: { id: userId } },
            order: { updatedAt: 'DESC' },
            relations: ['tags', 'folder']
        });
    }
    async createNote(createDto, userId) {
        const note = this.noteRepository.create({
            title: createDto.title,
            type: createDto.type || 'note',
            content: createDto.content,
            isFavorite: createDto.isFavorite,
            folder: createDto.folderId ? { id: createDto.folderId } : null,
            user: { id: userId }
        });
        return this.noteRepository.save(note);
    }
    async updateNote(id, updateDto, userId) {
        const note = await this.noteRepository.findOne({ where: { id, user: { id: userId } } });
        if (!note)
            throw new Error(`Note ${id} not found`);
        const { tags, ...data } = updateDto;
        await this.noteRepository.update(id, data);
        return this.noteRepository.findOne({
            where: { id },
            relations: ['tags', 'folder']
        });
    }
    async removeNote(id, userId) {
        const result = await this.noteRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(note_entity_1.Note)),
    __param(1, (0, typeorm_1.InjectRepository)(note_folder_entity_1.NoteFolder)),
    __param(2, (0, typeorm_1.InjectRepository)(note_tag_entity_1.NoteTag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NotesService);
//# sourceMappingURL=notes.service.js.map