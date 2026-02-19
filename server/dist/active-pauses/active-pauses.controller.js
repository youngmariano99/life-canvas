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
exports.ActivePauseController = void 0;
const common_1 = require("@nestjs/common");
const active_pauses_service_1 = require("./active-pauses.service");
const active_pause_dto_1 = require("./dto/active-pause.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ActivePauseController = class ActivePauseController {
    activePauseService;
    constructor(activePauseService) {
        this.activePauseService = activePauseService;
    }
    createRoutine(req, createDto) {
        return this.activePauseService.createRoutine(req.user.userId, createDto);
    }
    findAllRoutines(req) {
        return this.activePauseService.findAllRoutines(req.user.userId);
    }
    updateRoutine(req, id, updateDto) {
        return this.activePauseService.updateRoutine(req.user.userId, id, updateDto);
    }
    removeRoutine(req, id) {
        return this.activePauseService.removeRoutine(req.user.userId, id);
    }
    createEntry(req, createDto) {
        return this.activePauseService.createEntry(req.user.userId, createDto);
    }
    findAllEntries(req) {
        return this.activePauseService.findAllEntries(req.user.userId);
    }
};
exports.ActivePauseController = ActivePauseController;
__decorate([
    (0, common_1.Post)('routines'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, active_pause_dto_1.CreateActivePauseRoutineDto]),
    __metadata("design:returntype", void 0)
], ActivePauseController.prototype, "createRoutine", null);
__decorate([
    (0, common_1.Get)('routines'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ActivePauseController.prototype, "findAllRoutines", null);
__decorate([
    (0, common_1.Patch)('routines/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, active_pause_dto_1.UpdateActivePauseRoutineDto]),
    __metadata("design:returntype", void 0)
], ActivePauseController.prototype, "updateRoutine", null);
__decorate([
    (0, common_1.Delete)('routines/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ActivePauseController.prototype, "removeRoutine", null);
__decorate([
    (0, common_1.Post)('entries'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, active_pause_dto_1.CreateActivePauseEntryDto]),
    __metadata("design:returntype", void 0)
], ActivePauseController.prototype, "createEntry", null);
__decorate([
    (0, common_1.Get)('entries'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ActivePauseController.prototype, "findAllEntries", null);
exports.ActivePauseController = ActivePauseController = __decorate([
    (0, common_1.Controller)('active-pauses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [active_pauses_service_1.ActivePauseService])
], ActivePauseController);
//# sourceMappingURL=active-pauses.controller.js.map