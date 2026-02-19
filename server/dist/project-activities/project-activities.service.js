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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_activity_entity_1 = require("./entities/project-activity.entity");
let ProjectActivitiesService = class ProjectActivitiesService {
    projectActivityRepository;
    constructor(projectActivityRepository) {
        this.projectActivityRepository = projectActivityRepository;
    }
    async create(createDto, userId) {
        const data = { ...createDto };
        if (typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }
        const activity = this.projectActivityRepository.create({
            ...data,
            project: { id: createDto.projectId },
            role: createDto.roleId ? { id: createDto.roleId } : null
        });
        return this.projectActivityRepository.save(activity);
    }
    async findAll(userId) {
        return this.projectActivityRepository.find({
            where: {
                project: {
                    goal: { user: { id: userId } }
                }
            },
            order: { sortOrder: 'ASC' }
        });
    }
    async findOne(id, userId) {
        return this.projectActivityRepository.findOne({
            where: {
                id,
                project: { goal: { user: { id: userId } } }
            }
        });
    }
    async update(id, updateDto, userId) {
        const activity = await this.findOne(id, userId);
        if (!activity)
            throw new Error(`Activity ${id} not found`);
        const data = { ...updateDto };
        if (data.dueDate && typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }
        await this.projectActivityRepository.update(id, data);
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const activity = await this.findOne(id, userId);
        if (activity) {
            await this.projectActivityRepository.delete(id);
            return { deleted: true };
        }
        return { deleted: false };
    }
};
exports.ProjectActivitiesService = ProjectActivitiesService;
exports.ProjectActivitiesService = ProjectActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_activity_entity_1.ProjectActivity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectActivitiesService);
//# sourceMappingURL=project-activities.service.js.map