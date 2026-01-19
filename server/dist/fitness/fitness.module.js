"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FitnessModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fitness_service_1 = require("./fitness.service");
const fitness_controller_1 = require("./fitness.controller");
const fitness_activity_entity_1 = require("./entities/fitness-activity.entity");
const fitness_routine_entity_1 = require("./entities/fitness-routine.entity");
const user_entity_1 = require("../database/entities/user.entity");
let FitnessModule = class FitnessModule {
};
exports.FitnessModule = FitnessModule;
exports.FitnessModule = FitnessModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([fitness_activity_entity_1.FitnessActivity, fitness_routine_entity_1.FitnessRoutine, user_entity_1.User])],
        controllers: [fitness_controller_1.FitnessController],
        providers: [fitness_service_1.FitnessService],
    })
], FitnessModule);
//# sourceMappingURL=fitness.module.js.map