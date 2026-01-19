"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFitnessActivityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_fitness_activity_dto_1 = require("./create-fitness-activity.dto");
class UpdateFitnessActivityDto extends (0, mapped_types_1.PartialType)(create_fitness_activity_dto_1.CreateFitnessActivityDto) {
}
exports.UpdateFitnessActivityDto = UpdateFitnessActivityDto;
//# sourceMappingURL=update-fitness-activity.dto.js.map