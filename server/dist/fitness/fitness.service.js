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
const user_entity_1 = require("../database/entities/user.entity");
let FitnessService = class FitnessService {
    activityRepository;
    routineRepository;
    userRepository;
    constructor(activityRepository, routineRepository, userRepository) {
        this.activityRepository = activityRepository;
        this.routineRepository = routineRepository;
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
        const user = await this.getDemoUser();
        const activityDate = typeof createDto.date === 'string'
            ? new Date(createDto.date)
            : createDto.date;
        const activity = this.activityRepository.create({
            ...createDto,
            date: activityDate,
            user
        });
        return this.activityRepository.save(activity);
    }
    async findAll() {
        const user = await this.getDemoUser();
        return this.activityRepository.find({
            where: { user: { id: user.id } },
            order: { date: 'DESC' },
            take: 100
        });
    }
    async findOne(id) {
        return this.activityRepository.findOneBy({ id });
    }
    async update(id, updateDto) {
        const data = { ...updateDto };
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
        }
        await this.activityRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        await this.activityRepository.delete(id);
        return { deleted: true };
    }
    async createRoutine(createDto) {
        const user = await this.getDemoUser();
        const routine = this.routineRepository.create({
            ...createDto,
            user,
        });
        return this.routineRepository.save(routine);
    }
    async findAllRoutines() {
        const user = await this.getDemoUser();
        return this.routineRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' }
        });
    }
    async deleteRoutine(id) {
        await this.routineRepository.delete(id);
        return { deleted: true };
    }
};
exports.FitnessService = FitnessService;
exports.FitnessService = FitnessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fitness_activity_entity_1.FitnessActivity)),
    __param(1, (0, typeorm_1.InjectRepository)(fitness_routine_entity_1.FitnessRoutine)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FitnessService);
//# sourceMappingURL=fitness.service.js.map