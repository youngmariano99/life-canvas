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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteFolder = void 0;
const typeorm_1 = require("typeorm");
let NoteFolder = class NoteFolder {
    id;
    userId;
    name;
    parentId;
    createdAt;
    user;
    parent;
    children;
    notes;
};
exports.NoteFolder = NoteFolder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NoteFolder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], NoteFolder.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], NoteFolder.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', nullable: true }),
    __metadata("design:type", String)
], NoteFolder.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NoteFolder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', (user) => user.noteFolders, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Function)
], NoteFolder.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('NoteFolder', (folder) => folder.children, { onDelete: 'CASCADE', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", NoteFolder)
], NoteFolder.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('NoteFolder', (folder) => folder.parent),
    __metadata("design:type", Array)
], NoteFolder.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Note', (note) => note.folder),
    __metadata("design:type", Array)
], NoteFolder.prototype, "notes", void 0);
exports.NoteFolder = NoteFolder = __decorate([
    (0, typeorm_1.Entity)('note_folders')
], NoteFolder);
//# sourceMappingURL=note-folder.entity.js.map