"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNoteFolderDto = exports.UpdateNoteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_note_dto_1 = require("./create-note.dto");
class UpdateNoteDto extends (0, mapped_types_1.PartialType)(create_note_dto_1.CreateNoteDto) {
}
exports.UpdateNoteDto = UpdateNoteDto;
class UpdateNoteFolderDto extends (0, mapped_types_1.PartialType)(create_note_dto_1.CreateNoteFolderDto) {
}
exports.UpdateNoteFolderDto = UpdateNoteFolderDto;
//# sourceMappingURL=update-note.dto.js.map