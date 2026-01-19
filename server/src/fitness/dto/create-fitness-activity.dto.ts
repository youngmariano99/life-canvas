import { IsString, IsInt, IsOptional, IsDateString, IsIn, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFitnessActivityDto {
    @IsString()
    @IsIn(['neat', 'workout'])
    type: 'neat' | 'workout';

    @IsString()
    name: string;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    duration?: number; // in minutes

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    calories?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    distance?: number; // in km

    @IsString()
    @IsOptional()
    notes?: string;

    @IsDateString()
    date: string; // ISO or YYYY-MM-DD
}
