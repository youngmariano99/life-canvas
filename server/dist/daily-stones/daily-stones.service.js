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
exports.DailyStonesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_stone_entity_1 = require("./entities/daily-stone.entity");
let DailyStonesService = class DailyStonesService {
    dailyStoneRepository;
    constructor(dailyStoneRepository) {
        this.dailyStoneRepository = dailyStoneRepository;
    }
    async findAll(userId, year = 2026) {
        return this.dailyStoneRepository.find({
            where: { user: { id: userId }, year },
            order: { date: 'DESC' },
            take: 365,
            relations: ['role']
        });
    }
    async upsert(dto, userId) {
        const dateStr = dto.date.split('T')[0];
        const year = new Date(dateStr).getFullYear();
        let stone = await this.dailyStoneRepository.createQueryBuilder('stone')
            .where('stone.user_id = :userId', { userId: userId })
            .andWhere('stone.date = :date', { date: dateStr })
            .getOne();
        if (stone) {
            stone.title = dto.title;
            stone.roleId = dto.roleId || null;
            stone.completed = dto.completed ?? false;
            stone.note = dto.note || '';
            stone.year = year;
        }
        else {
            stone = this.dailyStoneRepository.create({
                user: { id: userId },
                date: dateStr,
                title: dto.title,
                roleId: dto.roleId || null,
                completed: dto.completed || false,
                note: dto.note || '',
                year: year
            });
        }
        return this.dailyStoneRepository.save(stone);
    }
};
exports.DailyStonesService = DailyStonesService;
exports.DailyStonesService = DailyStonesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_stone_entity_1.DailyStone)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DailyStonesService);
//# sourceMappingURL=daily-stones.service.js.map