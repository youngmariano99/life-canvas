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
exports.NoteTag = void 0;
const typeorm_1 = require("typeorm");
let NoteTag = class NoteTag {
    id;
    userId;
    name;
    color;
    type;
    referenceId;
    createdAt;
    user;
    notes;
};
exports.NoteTag = NoteTag;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NoteTag.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], NoteTag.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], NoteTag.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: '#808080' }),
    __metadata("design:type", String)
], NoteTag.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'custom' }),
    __metadata("design:type", String)
], NoteTag.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", String)
], NoteTag.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], NoteTag.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', (user) => user.noteTags, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Function)
], NoteTag.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)('Note', (note) => note.tags),
    __metadata("design:type", Array)
], NoteTag.prototype, "notes", void 0);
exports.NoteTag = NoteTag = __decorate([
    (0, typeorm_1.Entity)('note_tags')
], NoteTag);
//# sourceMappingURL=note-tag.entity.js.map