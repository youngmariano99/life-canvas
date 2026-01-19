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
const user_entity_1 = require("../database/entities/user.entity");
let RolesService = class RolesService {
    roleRepository;
    userRepository;
    constructor(roleRepository, userRepository) {
        this.roleRepository = roleRepository;
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
    async create(createRoleDto) {
        const user = await this.getDemoUser();
        const role = this.roleRepository.create({
            ...createRoleDto,
            user,
        });
        return this.roleRepository.save(role);
    }
    async findAll() {
        const user = await this.getDemoUser();
        return this.roleRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return this.roleRepository.findOneBy({ id });
    }
    async update(id, updateRoleDto) {
        await this.roleRepository.update(id, updateRoleDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.roleRepository.delete(id);
        return { deleted: true };
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map