"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearsModule = void 0;
const common_1 = require("@nestjs/common");
const years_service_1 = require("./years.service");
const years_controller_1 = require("./years.controller");
const typeorm_1 = require("@nestjs/typeorm");
const goal_entity_1 = require("../goals/entities/goal.entity");
const habit_entity_1 = require("../habits/entities/habit.entity");
const year_settings_entity_1 = require("./entities/year-settings.entity");
let YearsModule = class YearsModule {
};
exports.YearsModule = YearsModule;
exports.YearsModule = YearsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([goal_entity_1.Goal, habit_entity_1.Habit, year_settings_entity_1.YearSettings])],
        controllers: [years_controller_1.YearsController],
        providers: [years_service_1.YearsService],
    })
], YearsModule);
//# sourceMappingURL=years.module.js.map