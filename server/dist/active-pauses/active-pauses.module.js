"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivePauseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const active_pauses_service_1 = require("./active-pauses.service");
const active_pauses_controller_1 = require("./active-pauses.controller");
const active_pause_routine_entity_1 = require("./entities/active-pause-routine.entity");
const active_pause_entry_entity_1 = require("./entities/active-pause-entry.entity");
let ActivePauseModule = class ActivePauseModule {
};
exports.ActivePauseModule = ActivePauseModule;
exports.ActivePauseModule = ActivePauseModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([active_pause_routine_entity_1.ActivePauseRoutineEntity, active_pause_entry_entity_1.ActivePauseEntryEntity])],
        controllers: [active_pauses_controller_1.ActivePauseController],
        providers: [active_pauses_service_1.ActivePauseService],
        exports: [active_pauses_service_1.ActivePauseService]
    })
], ActivePauseModule);
//# sourceMappingURL=active-pauses.module.js.map