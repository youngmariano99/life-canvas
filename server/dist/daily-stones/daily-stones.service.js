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
const user_entity_1 = require("../database/entities/user.entity");
let DailyStonesService = class DailyStonesService {
    dailyStoneRepository;
    userRepository;
    constructor(dailyStoneRepository, userRepository) {
        this.dailyStoneRepository = dailyStoneRepository;
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
        return this.dailyStoneRepository.find({
            where: { user: { id: user.id } },
            order: { date: 'DESC' },
            take: 365,
            relations: ['role']
        });
    }
    async upsert(dto) {
        const user = await this.getDemoUser();
        const dateStr = dto.date.split('T')[0];
        let stone = await this.dailyStoneRepository.createQueryBuilder('stone')
            .where('stone.user_id = :userId', { userId: user.id })
            .andWhere('stone.date = :date', { date: dateStr })
            .getOne();
        if (stone) {
            stone.title = dto.title;
            stone.roleId = dto.roleId || null;
            stone.completed = dto.completed ?? false;
            stone.note = dto.note || '';
        }
        else {
            stone = this.dailyStoneRepository.create({
                user,
                date: dateStr,
                title: dto.title,
                roleId: dto.roleId || null,
                completed: dto.completed || false,
                note: dto.note || ''
            });
        }
        return this.dailyStoneRepository.save(stone);
    }
};
exports.DailyStonesService = DailyStonesService;
exports.DailyStonesService = DailyStonesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_stone_entity_1.DailyStone)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DailyStonesService);
//# sourceMappingURL=daily-stones.service.js.map