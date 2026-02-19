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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateActivePauseEntryDto = exports.UpdateActivePauseRoutineDto = exports.CreateActivePauseRoutineDto = void 0;
const class_validator_1 = require("class-validator");
class CreateActivePauseRoutineDto {
    nombre;
    duracion;
    pasos;
    nivel;
    zona;
}
exports.CreateActivePauseRoutineDto = CreateActivePauseRoutineDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivePauseRoutineDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivePauseRoutineDto.prototype, "duracion", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateActivePauseRoutineDto.prototype, "pasos", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivePauseRoutineDto.prototype, "nivel", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateActivePauseRoutineDto.prototype, "zona", void 0);
class UpdateActivePauseRoutineDto extends CreateActivePauseRoutineDto {
}
exports.UpdateActivePauseRoutineDto = UpdateActivePauseRoutineDto;
class CreateActivePauseEntryDto {
    routineId;
    date;
    completed;
    waterIntake;
    eyeCare;
}
exports.CreateActivePauseEntryDto = CreateActivePauseEntryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivePauseEntryDto.prototype, "routineId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateActivePauseEntryDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateActivePauseEntryDto.prototype, "completed", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateActivePauseEntryDto.prototype, "waterIntake", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateActivePauseEntryDto.prototype, "eyeCare", void 0);
//# sourceMappingURL=active-pause.dto.js.map