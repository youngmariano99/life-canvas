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
exports.ActivePauseEntryEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../database/entities/user.entity");
const active_pause_routine_entity_1 = require("./active-pause-routine.entity");
let ActivePauseEntryEntity = class ActivePauseEntryEntity {
    id;
    date;
    routineId;
    routine;
    completed;
    waterIntake;
    eyeCare;
    user;
    userId;
    createdAt;
};
exports.ActivePauseEntryEntity = ActivePauseEntryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ActivePauseEntryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ActivePauseEntryEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActivePauseEntryEntity.prototype, "routineId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => active_pause_routine_entity_1.ActivePauseRoutineEntity, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'routineId' }),
    __metadata("design:type", active_pause_routine_entity_1.ActivePauseRoutineEntity)
], ActivePauseEntryEntity.prototype, "routine", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ActivePauseEntryEntity.prototype, "completed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ActivePauseEntryEntity.prototype, "waterIntake", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ActivePauseEntryEntity.prototype, "eyeCare", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ActivePauseEntryEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActivePauseEntryEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivePauseEntryEntity.prototype, "createdAt", void 0);
exports.ActivePauseEntryEntity = ActivePauseEntryEntity = __decorate([
    (0, typeorm_1.Entity)('active_pause_entries')
], ActivePauseEntryEntity);
//# sourceMappingURL=active-pause-entry.entity.js.map