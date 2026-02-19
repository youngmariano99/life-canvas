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
let HabitsService = class HabitsService {
    habitRepository;
    constructor(habitRepository) {
        this.habitRepository = habitRepository;
    }
    async create(createHabitDto, userId) {
        const habit = this.habitRepository.create({
            ...createHabitDto,
            user: { id: userId },
            role: createHabitDto.roleId ? { id: createHabitDto.roleId } : null
        });
        return this.habitRepository.save(habit);
    }
    async findAll(userId, year = 2026) {
        return this.habitRepository.find({
            where: { user: { id: userId }, year },
            order: { createdAt: 'DESC' },
            relations: ['role', 'logs']
        });
    }
    async findOne(id, userId) {
        return this.habitRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['logs']
        });
    }
    async update(id, updateHabitDto, userId) {
        const habit = await this.findOne(id, userId);
        if (!habit) {
            throw new Error(`Habit ${id} not found`);
        }
        await this.habitRepository.update(id, updateHabitDto);
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const result = await this.habitRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
};
exports.HabitsService = HabitsService;
exports.HabitsService = HabitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(habit_entity_1.Habit)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HabitsService);
//# sourceMappingURL=habits.service.js.map