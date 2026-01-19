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
exports.HabitsController = void 0;
const common_1 = require("@nestjs/common");
const habits_service_1 = require("./habits.service");
const create_habit_dto_1 = require("./dto/create-habit.dto");
const update_habit_dto_1 = require("./dto/update-habit.dto");
let HabitsController = class HabitsController {
    habitsService;
    constructor(habitsService) {
        this.habitsService = habitsService;
    }
    create(createHabitDto) {
        return this.habitsService.create(createHabitDto);
    }
    findAll() {
        return this.habitsService.findAll();
    }
    findOne(id) {
        return this.habitsService.findOne(id);
    }
    update(id, updateHabitDto) {
        return this.habitsService.update(id, updateHabitDto);
    }
    remove(id) {
        return this.habitsService.remove(id);
    }
};
exports.HabitsController = HabitsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_habit_dto_1.CreateHabitDto]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_habit_dto_1.UpdateHabitDto]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "remove", null);
exports.HabitsController = HabitsController = __decorate([
    (0, common_1.Controller)('habits'),
    __metadata("design:paramtypes", [habits_service_1.HabitsService])
], HabitsController);
//# sourceMappingURL=habits.controller.js.map