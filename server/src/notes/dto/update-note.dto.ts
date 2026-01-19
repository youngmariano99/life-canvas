import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto, CreateNoteFolderDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) { }
export class UpdateNoteFolderDto extends PartialType(CreateNoteFolderDto) { }
