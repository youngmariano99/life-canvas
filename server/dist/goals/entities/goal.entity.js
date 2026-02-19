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
exports.Goal = void 0;
const typeorm_1 = require("typeorm");
let Goal = class Goal {
    id;
    userId;
    roleId;
    title;
    year;
    description;
    quarter;
    semester;
    targetDate;
    status;
    createdAt;
    updatedAt;
    user;
    role;
    projects;
    deviations;
    resources;
    subGoals;
};
exports.Goal = Goal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Goal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Goal.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id' }),
    __metadata("design:type", String)
], Goal.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Goal.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 2026 }),
    __metadata("design:type", Number)
], Goal.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Goal.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', nullable: true }),
    __metadata("design:type", Number)
], Goal.prototype, "quarter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', nullable: true }),
    __metadata("design:type", Number)
], Goal.prototype, "semester", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Goal.prototype, "targetDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending', length: 20, nullable: true }),
    __metadata("design:type", String)
], Goal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Goal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Goal.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', (user) => user.goals, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Function)
], Goal.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Role', (role) => role.goals, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", Function)
], Goal.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Project', (project) => project.goal),
    __metadata("design:type", Array)
], Goal.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Deviation', (deviation) => deviation.goal),
    __metadata("design:type", Array)
], Goal.prototype, "deviations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Resource', (resource) => resource.goal),
    __metadata("design:type", Array)
], Goal.prototype, "resources", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('SubGoal', (subGoal) => subGoal.goal, { cascade: true }),
    __metadata("design:type", Array)
], Goal.prototype, "subGoals", void 0);
exports.Goal = Goal = __decorate([
    (0, typeorm_1.Entity)('goals')
], Goal);
//# sourceMappingURL=goal.entity.js.map