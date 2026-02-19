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
exports.DailyStonesController = void 0;
const common_1 = require("@nestjs/common");
const daily_stones_service_1 = require("./daily-stones.service");
const create_daily_stone_dto_1 = require("./dto/create-daily-stone.dto");
const passport_1 = require("@nestjs/passport");
let DailyStonesController = class DailyStonesController {
    dailyStonesService;
    constructor(dailyStonesService) {
        this.dailyStonesService = dailyStonesService;
    }
    findAll(req, year) {
        return this.dailyStonesService.findAll(req.user.id, year);
    }
    upsert(createDailyStoneDto, req) {
        return this.dailyStonesService.upsert(createDailyStoneDto, req.user.id);
    }
};
exports.DailyStonesController = DailyStonesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], DailyStonesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_daily_stone_dto_1.CreateDailyStoneDto, Object]),
    __metadata("design:returntype", void 0)
], DailyStonesController.prototype, "upsert", null);
exports.DailyStonesController = DailyStonesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('daily-stones'),
    __metadata("design:paramtypes", [daily_stones_service_1.DailyStonesService])
], DailyStonesController);
//# sourceMappingURL=daily-stones.controller.js.map