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
exports.PomodoroController = void 0;
const common_1 = require("@nestjs/common");
const pomodoro_service_1 = require("./pomodoro.service");
const passport_1 = require("@nestjs/passport");
let PomodoroController = class PomodoroController {
    pomodoroService;
    constructor(pomodoroService) {
        this.pomodoroService = pomodoroService;
    }
    create(req, createPomodoroDto) {
        return this.pomodoroService.create(req.user.userId, createPomodoroDto);
    }
    findAll(req) {
        return this.pomodoroService.findAll(req.user.userId);
    }
    findOne(req, id) {
        return this.pomodoroService.findOne(req.user.userId, id);
    }
    remove(req, id) {
        return this.pomodoroService.remove(req.user.userId, id);
    }
};
exports.PomodoroController = PomodoroController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PomodoroController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PomodoroController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PomodoroController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PomodoroController.prototype, "remove", null);
exports.PomodoroController = PomodoroController = __decorate([
    (0, common_1.Controller)('pomodoros'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [pomodoro_service_1.PomodoroService])
], PomodoroController);
//# sourceMappingURL=pomodoro.controller.js.map