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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
let ProjectsService = class ProjectsService {
    projectRepository;
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }
    async create(createProjectDto, userId) {
        const data = { ...createProjectDto };
        if (typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }
        const project = this.projectRepository.create({
            ...data,
            goal: { id: createProjectDto.goalId }
        });
        return this.projectRepository.save(project);
    }
    async findAll(userId, year = 2026) {
        return this.projectRepository.find({
            where: {
                year,
                goal: {
                    user: { id: userId }
                }
            },
            order: { createdAt: 'DESC' },
            relations: ['activities']
        });
    }
    async findOne(id, userId) {
        return this.projectRepository.findOne({
            where: {
                id,
                goal: { user: { id: userId } }
            },
            relations: ['activities']
        });
    }
    async update(id, updateProjectDto, userId) {
        const project = await this.findOne(id, userId);
        if (!project)
            throw new Error(`Project ${id} not found`);
        const data = { ...updateProjectDto };
        if (typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }
        await this.projectRepository.update(id, data);
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const project = await this.findOne(id, userId);
        if (project) {
            await this.projectRepository.delete(id);
            return { deleted: true };
        }
        return { deleted: false };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map