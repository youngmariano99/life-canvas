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
exports.YearsController = void 0;
const common_1 = require("@nestjs/common");
const years_service_1 = require("./years.service");
const passport_1 = require("@nestjs/passport");
let YearsController = class YearsController {
    yearsService;
    constructor(yearsService) {
        this.yearsService = yearsService;
    }
    getSettings(year, req) {
        return this.yearsService.getSettings(parseInt(year), req.user.id);
    }
    updateSettings(body, req) {
        return this.yearsService.updateSettings(body.year, req.user.id, body.settings);
    }
    closeYear(body, req) {
        return this.yearsService.closeYear(body.year, req.user.id);
    }
};
exports.YearsController = YearsController;
__decorate([
    (0, common_1.Get)('settings'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], YearsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)('settings'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], YearsController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Post)('close'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], YearsController.prototype, "closeYear", null);
exports.YearsController = YearsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('years'),
    __metadata("design:paramtypes", [years_service_1.YearsService])
], YearsController);
//# sourceMappingURL=years.controller.js.map