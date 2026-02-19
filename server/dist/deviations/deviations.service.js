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
exports.DeviationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deviation_entity_1 = require("./entities/deviation.entity");
let DeviationsService = class DeviationsService {
    deviationRepository;
    constructor(deviationRepository) {
        this.deviationRepository = deviationRepository;
    }
    async create(createDto, userId) {
        const deviationDate = typeof createDto.date === 'string'
            ? new Date(createDto.date)
            : createDto.date;
        const year = deviationDate.getFullYear();
        const deviation = this.deviationRepository.create({
            ...createDto,
            date: deviationDate,
            year: year,
            user: { id: userId },
            goal: createDto.goalId ? { id: createDto.goalId } : null
        });
        return this.deviationRepository.save(deviation);
    }
    async findAll(userId, year = 2026) {
        return this.deviationRepository.find({
            where: { user: { id: userId }, year },
            order: { date: 'DESC' },
            relations: ['goal']
        });
    }
    async findOne(id, userId) {
        return this.deviationRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['goal']
        });
    }
    async update(id, updateDto, userId) {
        const deviation = await this.findOne(id, userId);
        if (!deviation)
            throw new Error(`Deviation ${id} not found`);
        const data = { ...updateDto };
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
            data.year = data.date.getFullYear();
        }
        else if (data.date) {
            data.year = data.date.getFullYear();
        }
        await this.deviationRepository.update(id, data);
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const result = await this.deviationRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
};
exports.DeviationsService = DeviationsService;
exports.DeviationsService = DeviationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deviation_entity_1.Deviation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeviationsService);
//# sourceMappingURL=deviations.service.js.map