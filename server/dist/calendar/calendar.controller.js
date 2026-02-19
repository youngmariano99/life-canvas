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
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const calendar_service_1 = require("./calendar.service");
const create_calendar_event_dto_1 = require("./dto/create-calendar-event.dto");
const update_calendar_event_dto_1 = require("./dto/update-calendar-event.dto");
const passport_1 = require("@nestjs/passport");
let CalendarController = class CalendarController {
    calendarService;
    constructor(calendarService) {
        this.calendarService = calendarService;
    }
    create(createDto, req) {
        return this.calendarService.create(createDto, req.user.id);
    }
    findAll(req) {
        return this.calendarService.findAll(req.user.id);
    }
    findOne(id, req) {
        return this.calendarService.findOne(id, req.user.id);
    }
    update(id, updateDto, req) {
        return this.calendarService.update(id, updateDto, req.user.id);
    }
    remove(id, req) {
        return this.calendarService.remove(id, req.user.id);
    }
};
exports.CalendarController = CalendarController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_calendar_event_dto_1.CreateCalendarEventDto, Object]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_calendar_event_dto_1.UpdateCalendarEventDto, Object]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "remove", null);
exports.CalendarController = CalendarController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('calendar'),
    __metadata("design:paramtypes", [calendar_service_1.CalendarService])
], CalendarController);
//# sourceMappingURL=calendar.controller.js.map