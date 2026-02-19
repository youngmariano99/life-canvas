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
exports.FitnessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fitness_activity_entity_1 = require("./entities/fitness-activity.entity");
const fitness_routine_entity_1 = require("./entities/fitness-routine.entity");
let FitnessService = class FitnessService {
    activityRepository;
    routineRepository;
    constructor(activityRepository, routineRepository) {
        this.activityRepository = activityRepository;
        this.routineRepository = routineRepository;
    }
    async create(createDto, userId) {
        const activityDate = typeof createDto.date === 'string'
            ? new Date(createDto.date)
            : createDto.date;
        const activity = this.activityRepository.create({
            ...createDto,
            date: activityDate,
            user: { id: userId }
        });
        return this.activityRepository.save(activity);
    }
    async findAll(userId) {
        return this.activityRepository.find({
            where: { user: { id: userId } },
            order: { date: 'DESC' },
            take: 100
        });
    }
    async findOne(id, userId) {
        return this.activityRepository.findOne({ where: { id, user: { id: userId } } });
    }
    async update(id, updateDto, userId) {
        const activity = await this.findOne(id, userId);
        if (!activity)
            throw new Error(`Activity ${id} not found`);
        const data = { ...updateDto };
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
        }
        await this.activityRepository.update(id, data);
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const result = await this.activityRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
    async createRoutine(createDto, userId) {
        const routine = this.routineRepository.create({
            ...createDto,
            user: { id: userId },
        });
        return this.routineRepository.save(routine);
    }
    async findAllRoutines(userId) {
        return this.routineRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }
    async deleteRoutine(id, userId) {
        const result = await this.routineRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
};
exports.FitnessService = FitnessService;
exports.FitnessService = FitnessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fitness_activity_entity_1.FitnessActivity)),
    __param(1, (0, typeorm_1.InjectRepository)(fitness_routine_entity_1.FitnessRoutine)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FitnessService);
//# sourceMappingURL=fitness.service.js.map