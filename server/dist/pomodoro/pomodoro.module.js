"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomodoroModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pomodoro_service_1 = require("./pomodoro.service");
const pomodoro_controller_1 = require("./pomodoro.controller");
const pomodoro_entity_1 = require("./pomodoro.entity");
let PomodoroModule = class PomodoroModule {
};
exports.PomodoroModule = PomodoroModule;
exports.PomodoroModule = PomodoroModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pomodoro_entity_1.Pomodoro])],
        controllers: [pomodoro_controller_1.PomodoroController],
        providers: [pomodoro_service_1.PomodoroService],
        exports: [pomodoro_service_1.PomodoroService],
    })
], PomodoroModule);
//# sourceMappingURL=pomodoro.module.js.map