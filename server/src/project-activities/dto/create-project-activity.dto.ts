import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateProjectActivityDto {
    @IsString()
    projectId: string;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsInt()
    @IsOptional()
    sortOrder?: number;

    @IsDateString()
    @IsOptional()
    dueDate?: string; // ISO String

    @IsString()
    @IsOptional()
    roleId?: string;
}
