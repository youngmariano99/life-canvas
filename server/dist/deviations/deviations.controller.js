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
exports.DeviationsController = void 0;
const common_1 = require("@nestjs/common");
const deviations_service_1 = require("./deviations.service");
const create_deviation_dto_1 = require("./dto/create-deviation.dto");
const update_deviation_dto_1 = require("./dto/update-deviation.dto");
let DeviationsController = class DeviationsController {
    deviationsService;
    constructor(deviationsService) {
        this.deviationsService = deviationsService;
    }
    create(createDto) {
        return this.deviationsService.create(createDto);
    }
    findAll() {
        return this.deviationsService.findAll();
    }
    findOne(id) {
        return this.deviationsService.findOne(id);
    }
    update(id, updateDto) {
        return this.deviationsService.update(id, updateDto);
    }
    remove(id) {
        return this.deviationsService.remove(id);
    }
};
exports.DeviationsController = DeviationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deviation_dto_1.CreateDeviationDto]),
    __metadata("design:returntype", void 0)
], DeviationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeviationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeviationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_deviation_dto_1.UpdateDeviationDto]),
    __metadata("design:returntype", void 0)
], DeviationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeviationsController.prototype, "remove", null);
exports.DeviationsController = DeviationsController = __decorate([
    (0, common_1.Controller)('deviations'),
    __metadata("design:paramtypes", [deviations_service_1.DeviationsService])
], DeviationsController);
//# sourceMappingURL=deviations.controller.js.map