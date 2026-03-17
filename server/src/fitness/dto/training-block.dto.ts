import { IsString, IsInt, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateTrainingBlockDto {
    @IsString()
    name: string;

    @IsInt()
    @IsOptional()
    durationWeeks?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsArray()
    @IsOptional()
    routines?: any[];
}

export class UpdateTrainingBlockDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsInt()
    @IsOptional()
    durationWeeks?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsArray()
    @IsOptional()
    routines?: any[];
}
