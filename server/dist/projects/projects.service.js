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
const user_entity_1 = require("../database/entities/user.entity");
let ProjectsService = class ProjectsService {
    projectRepository;
    userRepository;
    constructor(projectRepository, userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    async getDemoUser() {
        let user = await this.userRepository.findOne({ where: { email: 'demo@lifecanvas.com' } });
        if (!user) {
            user = this.userRepository.create({
                email: 'demo@lifecanvas.com',
                name: 'Demo User',
            });
            await this.userRepository.save(user);
        }
        return user;
    }
    async create(createProjectDto) {
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
    async findAll() {
        const user = await this.getDemoUser();
        return this.projectRepository.find({
            where: {
                goal: {
                    user: { id: user.id }
                }
            },
            order: { createdAt: 'DESC' },
            relations: ['activities']
        });
    }
    async findOne(id) {
        return this.projectRepository.findOne({
            where: { id },
            relations: ['activities']
        });
    }
    async update(id, updateProjectDto) {
        const data = { ...updateProjectDto };
        if (typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }
        await this.projectRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        await this.projectRepository.delete(id);
        return { deleted: true };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map