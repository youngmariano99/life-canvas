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
exports.ProjectActivity = void 0;
const typeorm_1 = require("typeorm");
let ProjectActivity = class ProjectActivity {
    id;
    projectId;
    title;
    status;
    sortOrder;
    dueDate;
    roleId;
    createdAt;
    project;
    role;
};
exports.ProjectActivity = ProjectActivity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProjectActivity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'project_id' }),
    __metadata("design:type", String)
], ProjectActivity.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], ProjectActivity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Por hacer', length: 100, nullable: true }),
    __metadata("design:type", String)
], ProjectActivity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0, nullable: true }),
    __metadata("design:type", Number)
], ProjectActivity.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'due_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], ProjectActivity.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role_id', nullable: true }),
    __metadata("design:type", String)
], ProjectActivity.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ProjectActivity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Project', (project) => project.activities, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'project_id' }),
    __metadata("design:type", Function)
], ProjectActivity.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Role', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", Function)
], ProjectActivity.prototype, "role", void 0);
exports.ProjectActivity = ProjectActivity = __decorate([
    (0, typeorm_1.Entity)('project_activities')
], ProjectActivity);
//# sourceMappingURL=project-activity.entity.js.map