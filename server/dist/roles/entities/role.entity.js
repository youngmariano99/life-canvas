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
exports.Role = void 0;
const typeorm_1 = require("typeorm");
let Role = class Role {
    id;
    userId;
    name;
    icon;
    color;
    description;
    imageUrl;
    createdAt;
    user;
    goals;
    habits;
};
exports.Role = Role;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Role.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'circle', length: 50, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'student', length: 50, nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Role.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', (user) => user.roles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Function)
], Role.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Goal', (goal) => goal.role),
    __metadata("design:type", Array)
], Role.prototype, "goals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Habit', (habit) => habit.role),
    __metadata("design:type", Array)
], Role.prototype, "habits", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)('roles')
], Role);
//# sourceMappingURL=role.entity.js.map