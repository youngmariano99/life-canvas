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
exports.Deviation = void 0;
const typeorm_1 = require("typeorm");
let Deviation = class Deviation {
    id;
    userId;
    goalId;
    title;
    year;
    reason;
    correction;
    date;
    createdAt;
    user;
    goal;
};
exports.Deviation = Deviation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Deviation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Deviation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'goal_id', nullable: true }),
    __metadata("design:type", String)
], Deviation.prototype, "goalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Deviation.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 2026 }),
    __metadata("design:type", Number)
], Deviation.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Deviation.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Deviation.prototype, "correction", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date', type: 'date' }),
    __metadata("design:type", Date)
], Deviation.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Deviation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', (user) => user.deviations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Function)
], Deviation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Goal', (goal) => goal.deviations, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'goal_id' }),
    __metadata("design:type", Function)
], Deviation.prototype, "goal", void 0);
exports.Deviation = Deviation = __decorate([
    (0, typeorm_1.Entity)('deviations')
], Deviation);
//# sourceMappingURL=deviation.entity.js.map