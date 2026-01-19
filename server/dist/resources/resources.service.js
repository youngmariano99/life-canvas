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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resource_entity_1 = require("./entities/resource.entity");
const user_entity_1 = require("../database/entities/user.entity");
let ResourcesService = class ResourcesService {
    resourceRepository;
    userRepository;
    constructor(resourceRepository, userRepository) {
        this.resourceRepository = resourceRepository;
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
    async create(createDto) {
        const resource = this.resourceRepository.create({
            ...createDto,
            goal: createDto.goalId ? { id: createDto.goalId } : undefined,
        });
        return this.resourceRepository.save(resource);
    }
    async findAll() {
        const user = await this.getDemoUser();
        return this.resourceRepository.find({
            where: {
                goal: { user: { id: user.id } }
            },
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        return this.resourceRepository.findOneBy({ id });
    }
    async update(id, updateDto) {
        await this.resourceRepository.update(id, updateDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.resourceRepository.delete(id);
        return { deleted: true };
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resource_entity_1.Resource)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map