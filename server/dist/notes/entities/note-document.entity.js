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
exports.NoteDocument = void 0;
const typeorm_1 = require("typeorm");
let NoteDocument = class NoteDocument {
    id;
    userId;
    noteId;
    filename;
    path;
    mimetype;
    size;
    createdAt;
    user;
    note;
};
exports.NoteDocument = NoteDocument;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NoteDocument.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], NoteDocument.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note_id' }),
    __metadata("design:type", String)
], NoteDocument.prototype, "noteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], NoteDocument.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], NoteDocument.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], NoteDocument.prototype, "mimetype", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], NoteDocument.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NoteDocument.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Function)
], NoteDocument.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Note', { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'note_id' }),
    __metadata("design:type", Function)
], NoteDocument.prototype, "note", void 0);
exports.NoteDocument = NoteDocument = __decorate([
    (0, typeorm_1.Entity)('note_documents')
], NoteDocument);
//# sourceMappingURL=note-document.entity.js.map