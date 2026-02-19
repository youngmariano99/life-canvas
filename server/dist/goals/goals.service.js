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
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goal_entity_1 = require("./entities/goal.entity");
const sub_goal_entity_1 = require("./entities/sub-goal.entity");
let GoalsService = class GoalsService {
    goalRepository;
    subGoalRepository;
    constructor(goalRepository, subGoalRepository) {
        this.goalRepository = goalRepository;
        this.subGoalRepository = subGoalRepository;
    }
    async create(createGoalDto, userId) {
        const data = { ...createGoalDto };
        if (typeof data.targetDate === 'string') {
            data.targetDate = new Date(data.targetDate);
        }
        const goal = this.goalRepository.create({
            ...data,
            user: { id: userId },
            role: { id: createGoalDto.roleId }
        });
        return this.goalRepository.save(goal);
    }
    async findAll(userId, year = 2026) {
        return this.goalRepository.find({
            where: { user: { id: userId }, year },
            relations: ['projects', 'resources', 'subGoals'],
            order: { quarter: 'ASC', createdAt: 'DESC' }
        });
    }
    async findOne(id, userId) {
        return this.goalRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['role', 'projects', 'resources', 'subGoals']
        });
    }
    async update(id, updateGoalDto, userId) {
        const existingGoal = await this.findOne(id, userId);
        if (!existingGoal) {
            throw new common_1.NotFoundException(`Goal #${id} not found`);
        }
        const data = { ...updateGoalDto };
        if (typeof data.targetDate === 'string') {
            data.targetDate = new Date(data.targetDate);
        }
        if (data.subGoals && Array.isArray(data.subGoals)) {
            if (existingGoal.subGoals) {
                const incomingIds = data.subGoals.map((sg) => sg.id).filter((id) => id);
                const toRemove = existingGoal.subGoals.filter(sg => !incomingIds.includes(sg.id));
                if (toRemove.length > 0) {
                    await this.subGoalRepository.remove(toRemove);
                }
            }
        }
        const goal = await this.goalRepository.preload({
            id: id,
            ...data,
        });
        if (!goal) {
            throw new common_1.NotFoundException(`Goal #${id} not found`);
        }
        return this.goalRepository.save(goal);
    }
    async remove(id, userId) {
        const result = await this.goalRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(goal_entity_1.Goal)),
    __param(1, (0, typeorm_1.InjectRepository)(sub_goal_entity_1.SubGoal)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GoalsService);
//# sourceMappingURL=goals.service.js.map