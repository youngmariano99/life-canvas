"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeviationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_deviation_dto_1 = require("./create-deviation.dto");
class UpdateDeviationDto extends (0, mapped_types_1.PartialType)(create_deviation_dto_1.CreateDeviationDto) {
}
exports.UpdateDeviationDto = UpdateDeviationDto;
//# sourceMappingURL=update-deviation.dto.js.map