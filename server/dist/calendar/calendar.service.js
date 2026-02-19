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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const calendar_event_entity_1 = require("./entities/calendar-event.entity");
let CalendarService = class CalendarService {
    calendarRepository;
    constructor(calendarRepository) {
        this.calendarRepository = calendarRepository;
    }
    async create(createDto, userId) {
        const rawStartDate = createDto.startDate || createDto.date;
        if (!rawStartDate) {
            throw new Error('Start date or date is required');
        }
        const startDate = typeof rawStartDate === 'string'
            ? new Date(rawStartDate)
            : rawStartDate;
        const endDate = createDto.endDate
            ? (typeof createDto.endDate === 'string' ? new Date(createDto.endDate) : createDto.endDate)
            : startDate;
        const event = this.calendarRepository.create({
            ...createDto,
            startDate,
            endDate,
            user: { id: userId }
        });
        return this.calendarRepository.save(event);
    }
    async findAll(userId) {
        return this.calendarRepository.find({
            where: { user: { id: userId } },
            order: { startDate: 'ASC' },
            take: 200
        });
    }
    async findOne(id, userId) {
        return this.calendarRepository.findOne({ where: { id, user: { id: userId } } });
    }
    async update(id, updateDto, userId) {
        const event = await this.findOne(id, userId);
        if (!event)
            throw new Error(`Event ${id} not found`);
        const data = { ...updateDto };
        if (data.startDate && typeof data.startDate === 'string') {
            data.startDate = new Date(data.startDate);
        }
        if (data.endDate && typeof data.endDate === 'string') {
            data.endDate = new Date(data.endDate);
        }
        await this.calendarRepository.update(id, data);
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const result = await this.calendarRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_event_entity_1.CalendarEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map