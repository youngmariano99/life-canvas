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
exports.YearsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goal_entity_1 = require("../goals/entities/goal.entity");
const habit_entity_1 = require("../habits/entities/habit.entity");
const year_settings_entity_1 = require("./entities/year-settings.entity");
let YearsService = class YearsService {
    goalRepository;
    habitRepository;
    settingsRepository;
    constructor(goalRepository, habitRepository, settingsRepository) {
        this.goalRepository = goalRepository;
        this.habitRepository = habitRepository;
        this.settingsRepository = settingsRepository;
    }
    async getSettings(year, userId) {
        return this.settingsRepository.findOne({
            where: { year, user: { id: userId } }
        });
    }
    async updateSettings(year, userId, settings) {
        const existing = await this.getSettings(year, userId);
        if (existing) {
            return this.settingsRepository.save({
                ...existing,
                ...settings
            });
        }
        const newSettings = this.settingsRepository.create({
            ...settings,
            year,
            user: { id: userId }
        });
        return this.settingsRepository.save(newSettings);
    }
    async closeYear(year, userId) {
        const nextYear = year + 1;
        const goalsToMigrate = await this.goalRepository.find({
            where: {
                user: { id: userId },
                year: year,
            },
            relations: ['subGoals']
        });
        const pendingGoals = goalsToMigrate.filter(g => g.status !== 'completed');
        for (const goal of pendingGoals) {
            const exists = await this.goalRepository.findOne({
                where: {
                    user: { id: userId },
                    year: nextYear,
                    title: goal.title
                }
            });
            if (!exists) {
                const newGoal = this.goalRepository.create({
                    ...goal,
                    id: undefined,
                    year: nextYear,
                    createdAt: undefined,
                    updatedAt: undefined,
                    user: { id: userId },
                    role: { id: goal.roleId },
                    subGoals: goal.subGoals?.map(sg => ({
                        ...sg,
                        id: undefined,
                        createdAt: undefined,
                        updatedAt: undefined
                    }))
                });
                await this.goalRepository.save(newGoal);
            }
        }
        const habits = await this.habitRepository.find({
            where: { user: { id: userId }, year: year }
        });
        for (const habit of habits) {
            const exists = await this.habitRepository.findOne({
                where: {
                    user: { id: userId },
                    year: nextYear,
                    name: habit.name
                }
            });
            if (!exists) {
                const newHabit = this.habitRepository.create({
                    ...habit,
                    id: undefined,
                    year: nextYear,
                    createdAt: undefined,
                    user: { id: userId },
                    role: habit.roleId ? { id: habit.roleId } : null,
                    logs: []
                });
                await this.habitRepository.save(newHabit);
            }
        }
        return {
            success: true,
            message: `Successfully closed ${year} and prepared ${nextYear}`,
            migratedGoals: pendingGoals.length,
            migratedHabits: habits.length
        };
    }
};
exports.YearsService = YearsService;
exports.YearsService = YearsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(goal_entity_1.Goal)),
    __param(1, (0, typeorm_1.InjectRepository)(habit_entity_1.Habit)),
    __param(2, (0, typeorm_1.InjectRepository)(year_settings_entity_1.YearSettings)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], YearsService);
//# sourceMappingURL=years.service.js.map