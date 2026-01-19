import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    goalId: string;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string; // ISO String

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    statuses?: string[];
}
