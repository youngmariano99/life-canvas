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
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const notes_service_1 = require("./notes.service");
const create_note_dto_1 = require("./dto/create-note.dto");
const update_note_dto_1 = require("./dto/update-note.dto");
let NotesController = class NotesController {
    notesService;
    constructor(notesService) {
        this.notesService = notesService;
    }
    findAllFolders() {
        return this.notesService.findAllFolders();
    }
    createFolder(createDto) {
        return this.notesService.createFolder(createDto);
    }
    updateFolder(id, updateDto) {
        return this.notesService.updateFolder(id, updateDto);
    }
    removeFolder(id) {
        return this.notesService.removeFolder(id);
    }
    findAllNotes() {
        return this.notesService.findAllNotes();
    }
    createNote(createDto) {
        return this.notesService.createNote(createDto);
    }
    updateNote(id, updateDto) {
        return this.notesService.updateNote(id, updateDto);
    }
    removeNote(id) {
        return this.notesService.removeNote(id);
    }
};
exports.NotesController = NotesController;
__decorate([
    (0, common_1.Get)('folders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "findAllFolders", null);
__decorate([
    (0, common_1.Post)('folders'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_note_dto_1.CreateNoteFolderDto]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Patch)('folders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_note_dto_1.UpdateNoteFolderDto]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "updateFolder", null);
__decorate([
    (0, common_1.Delete)('folders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "removeFolder", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "findAllNotes", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_note_dto_1.CreateNoteDto]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "createNote", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_note_dto_1.UpdateNoteDto]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "updateNote", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "removeNote", null);
exports.NotesController = NotesController = __decorate([
    (0, common_1.Controller)('notes'),
    __metadata("design:paramtypes", [notes_service_1.NotesService])
], NotesController);
//# sourceMappingURL=notes.controller.js.map