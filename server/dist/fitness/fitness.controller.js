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
let FitnessController = class FitnessController {
    fitnessService;
    constructor(fitnessService) {
        this.fitnessService = fitnessService;
    }
    createRoutine(createDto) {
        return this.fitnessService.createRoutine(createDto);
    }
    findAllRoutines() {
        return this.fitnessService.findAllRoutines();
    }
    deleteRoutine(id) {
        return this.fitnessService.deleteRoutine(id);
    }
    create(createDto) {
        return this.fitnessService.create(createDto);
    }
    findAll() {
        return this.fitnessService.findAll();
    }
    findOne(id) {
        return this.fitnessService.findOne(id);
    }
    update(id, updateDto) {
        return this.fitnessService.update(id, updateDto);
    }
    remove(id) {
        return this.fitnessService.remove(id);
    }
};
exports.FitnessController = FitnessController;
__decorate([
    (0, common_1.Post)('routines'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fitness_routine_dto_1.CreateFitnessRoutineDto]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "createRoutine", null);
__decorate([
    (0, common_1.Get)('routines'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "findAllRoutines", null);
__decorate([
    (0, common_1.Delete)('routines/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "deleteRoutine", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fitness_activity_dto_1.CreateFitnessActivityDto]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_fitness_activity_dto_1.UpdateFitnessActivityDto]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FitnessController.prototype, "remove", null);
exports.FitnessController = FitnessController = __decorate([
    (0, common_1.Controller)('fitness'),
    __metadata("design:paramtypes", [fitness_service_1.FitnessService])
], FitnessController);
//# sourceMappingURL=fitness.controller.js.map