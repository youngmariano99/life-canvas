import { IsString, IsOptional, IsArray, IsInt, Min, Max } from 'class-validator';

export class CreateHabitDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    roleId?: string;

    @IsString()
    @IsOptional()
    frequency?: string;

    @IsArray()
    @IsInt({ each: true })
    @Min(0, { each: true })
    @Max(6, { each: true })
    @IsOptional()
    customDays?: number[];
}
