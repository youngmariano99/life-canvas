"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProjectActivityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_project_activity_dto_1 = require("./create-project-activity.dto");
class UpdateProjectActivityDto extends (0, mapped_types_1.PartialType)(create_project_activity_dto_1.CreateProjectActivityDto) {
}
exports.UpdateProjectActivityDto = UpdateProjectActivityDto;
//# sourceMappingURL=update-project-activity.dto.js.map