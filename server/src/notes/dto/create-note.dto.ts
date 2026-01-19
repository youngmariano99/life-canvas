import { IsString, IsOptional, IsBoolean, IsArray, IsEnum } from 'class-validator';

export class CreateNoteFolderDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    parentId?: string; // null for root

    @IsString()
    @IsOptional()
    color?: string;

    @IsString()
    @IsOptional()
    icon?: string;
}

export class CreateNoteDto {
    @IsString()
    folderId: string;

    @IsString()
    @IsEnum(['note', 'whiteboard', 'document'])
    type: 'note' | 'whiteboard' | 'document';

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    contentJson?: string; // For rich text JSON structures

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsBoolean()
    @IsOptional()
    isFavorite?: boolean;
}
