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
exports.ActivePauseRoutineEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../database/entities/user.entity");
let ActivePauseRoutineEntity = class ActivePauseRoutineEntity {
    id;
    nombre;
    duracion;
    pasos;
    nivel;
    zona;
    user;
    userId;
    createdAt;
    updatedAt;
};
exports.ActivePauseRoutineEntity = ActivePauseRoutineEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ActivePauseRoutineEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActivePauseRoutineEntity.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActivePauseRoutineEntity.prototype, "duracion", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true }),
    __metadata("design:type", Array)
], ActivePauseRoutineEntity.prototype, "pasos", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActivePauseRoutineEntity.prototype, "nivel", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true }),
    __metadata("design:type", Array)
], ActivePauseRoutineEntity.prototype, "zona", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ActivePauseRoutineEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActivePauseRoutineEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivePauseRoutineEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ActivePauseRoutineEntity.prototype, "updatedAt", void 0);
exports.ActivePauseRoutineEntity = ActivePauseRoutineEntity = __decorate([
    (0, typeorm_1.Entity)('active_pause_routines')
], ActivePauseRoutineEntity);
//# sourceMappingURL=active-pause-routine.entity.js.map