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
exports.FitnessController = void 0;
const common_1 = require("@nestjs/common");
const fitness_service_1 = require("./fitness.service");
const create_fitness_activity_dto_1 = require("./dto/create-fitness-activity.dto");
const create_fitness_routine_dto_1 = require("./dto/create-fitness-routine.dto");
const update_fitness_activity_dto_1 = require("./dto/update-fitness-activity.dto");
const passport_1 = require("@nestjs/passport");
let FitnessController = class FitnessController {
    fitnessService;
    constructor(fitnessService) {
        this.fitnessService = fitnessService;
    }
    createRoutine(createDto, req) {
        return this.fitnessService.createRoutine(createDto, req.user.id);
    }
    findAllRoutines(req) {
        return this.fitnessService.findAllRoutines(req.user.id);
    }
    deleteRoutine(id, req) {
        return this.fitnessService.deleteRoutine(id, req.user.id);
    }
    create(createDto, req) {
        return this.fitnessService.create(createDto, req.user.id);
    }
    findAll(req) {
        return this.fitnessService.findAll(req.user.id);
    }
    findOne(id, req) {
        return this.fitnessService.findOne(id, req.user.id);
    }
    update(id, updateDto, req) {
        return this.fitnessService.update(id, updateDto, req.user.id);
    }
    remove(id, req) {
        return this.fitnessService.remove(id, req.user.id);
    }
};
exports.FitnessController = FitnessController;
__decorate([
    (0, common_1.Post)('routines'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fitness_routine_dto_1.CreateFitnessRoutineDto, Object]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "createRoutine", null);
__decorate([
    (0, common_1.Get)('routines'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "findAllRoutines", null);
__decorate([
    (0, common_1.Delete)('routines/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "deleteRoutine", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fitness_activity_dto_1.CreateFitnessActivityDto, Object]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_fitness_activity_dto_1.UpdateFitnessActivityDto, Object]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "remove", null);
exports.FitnessController = FitnessController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('fitness'),
    __metadata("design:paramtypes", [fitness_service_1.FitnessService])
], FitnessController);
//# sourceMappingURL=fitness.controller.js.map