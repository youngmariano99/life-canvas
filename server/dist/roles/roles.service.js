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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./entities/role.entity");
let RolesService = class RolesService {
    roleRepository;
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async create(createRoleDto, userId) {
        const role = this.roleRepository.create({
            ...createRoleDto,
            user: { id: userId },
        });
        return this.roleRepository.save(role);
    }
    async findAll(userId) {
        return this.roleRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        return this.roleRepository.findOne({ where: { id, user: { id: userId } } });
    }
    async update(id, updateRoleDto, userId) {
        const role = await this.findOne(id, userId);
        if (!role) {
            throw new Error(`Role ${id} not found`);
        }
        const updated = this.roleRepository.merge(role, updateRoleDto);
        return this.roleRepository.save(updated);
    }
    async remove(id, userId) {
        const result = await this.roleRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map