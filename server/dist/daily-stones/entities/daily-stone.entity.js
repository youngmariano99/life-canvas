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
exports.DailyStone = void 0;
const typeorm_1 = require("typeorm");
let DailyStone = class DailyStone {
    id;
    userId;
    date;
    title;
    roleId;
    completed;
    note;
    user;
    role;
};
exports.DailyStone = DailyStone;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyStone.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], DailyStone.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], DailyStone.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], DailyStone.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', nullable: true }),
    __metadata("design:type", Object)
], DailyStone.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, nullable: true }),
    __metadata("design:type", Boolean)
], DailyStone.prototype, "completed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DailyStone.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', (user) => user.dailyStones, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Function)
], DailyStone.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Role', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", Function)
], DailyStone.prototype, "role", void 0);
exports.DailyStone = DailyStone = __decorate([
    (0, typeorm_1.Entity)('daily_stones'),
    (0, typeorm_1.Unique)(['userId', 'date'])
], DailyStone);
//# sourceMappingURL=daily-stone.entity.js.map