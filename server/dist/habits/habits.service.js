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
exports.HabitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const habit_entity_1 = require("./entities/habit.entity");
const user_entity_1 = require("../database/entities/user.entity");
let HabitsService = class HabitsService {
    habitRepository;
    userRepository;
    constructor(habitRepository, userRepository) {
        this.habitRepository = habitRepository;
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
    async create(createHabitDto) {
        const user = await this.getDemoUser();
        const habit = this.habitRepository.create({
            ...createHabitDto,
            user,
            role: createHabitDto.roleId ? { id: createHabitDto.roleId } : null
        });
        return this.habitRepository.save(habit);
    }
    async findAll() {
        const user = await this.getDemoUser();
        return this.habitRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
            relations: ['role', 'logs']
        });
    }
    async findOne(id) {
        return this.habitRepository.findOne({
            where: { id },
            relations: ['logs']
        });
    }
    async update(id, updateHabitDto) {
        await this.habitRepository.update(id, updateHabitDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.habitRepository.delete(id);
        return { deleted: true };
    }
};
exports.HabitsService = HabitsService;
exports.HabitsService = HabitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(habit_entity_1.Habit)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], HabitsService);
//# sourceMappingURL=habits.service.js.map