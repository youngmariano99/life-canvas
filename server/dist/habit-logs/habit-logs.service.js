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
exports.HabitLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const habit_log_entity_1 = require("./entities/habit-log.entity");
const user_entity_1 = require("../database/entities/user.entity");
let HabitLogsService = class HabitLogsService {
    habitLogRepository;
    userRepository;
    constructor(habitLogRepository, userRepository) {
        this.habitLogRepository = habitLogRepository;
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
    async findAll() {
        const user = await this.getDemoUser();
        return this.habitLogRepository.find({
            where: {
                habit: { user: { id: user.id } }
            },
            order: { date: 'DESC' }
        });
    }
    async upsert(createHabitLogDto) {
        const { habitId, date, status, note } = createHabitLogDto;
        const dateStr = typeof date === 'string' ? date.split('T')[0] : date.toISOString().split('T')[0];
        let log = await this.habitLogRepository.createQueryBuilder('log')
            .where('log.habit_id = :habitId', { habitId })
            .andWhere('log.date = :date', { date: dateStr })
            .getOne();
        if (log) {
            if (status)
                log.status = status;
            if (note !== undefined)
                log.note = note;
        }
        else {
            log = this.habitLogRepository.create({
                habit: { id: habitId },
                date: dateStr,
                status: status || 'completed',
                note: note || ''
            });
        }
        return this.habitLogRepository.save(log);
    }
};
exports.HabitLogsService = HabitLogsService;
exports.HabitLogsService = HabitLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(habit_log_entity_1.HabitLog)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], HabitLogsService);
//# sourceMappingURL=habit-logs.service.js.map