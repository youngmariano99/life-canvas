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
exports.ActivePauseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const active_pause_routine_entity_1 = require("./entities/active-pause-routine.entity");
const active_pause_entry_entity_1 = require("./entities/active-pause-entry.entity");
let ActivePauseService = class ActivePauseService {
    routineRepo;
    entryRepo;
    constructor(routineRepo, entryRepo) {
        this.routineRepo = routineRepo;
        this.entryRepo = entryRepo;
    }
    async createRoutine(userId, createDto) {
        const routine = this.routineRepo.create({ ...createDto, userId });
        return this.routineRepo.save(routine);
    }
    async findAllRoutines(userId) {
        return this.routineRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }
    async updateRoutine(userId, id, updateDto) {
        await this.routineRepo.update({ id, userId }, updateDto);
        return this.routineRepo.findOne({ where: { id, userId } });
    }
    async removeRoutine(userId, id) {
        await this.routineRepo.delete({ id, userId });
        return { deleted: true };
    }
    async createEntry(userId, createDto) {
        const entry = this.entryRepo.create({
            ...createDto,
            userId,
            routine: { id: createDto.routineId }
        });
        return this.entryRepo.save(entry);
    }
    async findAllEntries(userId) {
        return this.entryRepo.find({
            where: { userId },
            order: { date: 'DESC' },
            relations: ['routine']
        });
    }
};
exports.ActivePauseService = ActivePauseService;
exports.ActivePauseService = ActivePauseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(active_pause_routine_entity_1.ActivePauseRoutineEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(active_pause_entry_entity_1.ActivePauseEntryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ActivePauseService);
//# sourceMappingURL=active-pauses.service.js.map