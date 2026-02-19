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
exports.Habit = void 0;
const typeorm_1 = require("typeorm");
let Habit = class Habit {
    id;
    userId;
    roleId;
    name;
    year;
    frequency;
    customDays;
    createdAt;
    user;
    role;
    logs;
};
exports.Habit = Habit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Habit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Habit.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', nullable: true }),
    __metadata("design:type", String)
], Habit.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Habit.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 2026 }),
    __metadata("design:type", Number)
], Habit.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'daily', length: 20, nullable: true }),
    __metadata("design:type", String)
], Habit.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)('smallint', { array: true, default: [], name: 'custom_days' }),
    __metadata("design:type", Array)
], Habit.prototype, "customDays", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Habit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', (user) => user.habits, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Function)
], Habit.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Role', (role) => role.habits),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", Function)
], Habit.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('HabitLog', (log) => log.habit),
    __metadata("design:type", Array)
], Habit.prototype, "logs", void 0);
exports.Habit = Habit = __decorate([
    (0, typeorm_1.Entity)('habits')
], Habit);
//# sourceMappingURL=habit.entity.js.map