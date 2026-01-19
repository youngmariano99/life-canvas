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
exports.FitnessRoutine = void 0;
const typeorm_1 = require("typeorm");
let FitnessRoutine = class FitnessRoutine {
    id;
    userId;
    name;
    type;
    structureType;
    rounds;
    content;
    createdAt;
    user;
};
exports.FitnessRoutine = FitnessRoutine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FitnessRoutine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], FitnessRoutine.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], FitnessRoutine.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], FitnessRoutine.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'structure_type', length: 50 }),
    __metadata("design:type", String)
], FitnessRoutine.prototype, "structureType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FitnessRoutine.prototype, "rounds", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { default: [] }),
    __metadata("design:type", Object)
], FitnessRoutine.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FitnessRoutine.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', (user) => user.fitnessRoutines, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Function)
], FitnessRoutine.prototype, "user", void 0);
exports.FitnessRoutine = FitnessRoutine = __decorate([
    (0, typeorm_1.Entity)('fitness_routines')
], FitnessRoutine);
//# sourceMappingURL=fitness-routine.entity.js.map