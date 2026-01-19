import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateDeviationDto {
    @IsString()
    @IsOptional()
    goalId?: string;

    @IsString()
    @IsOptional()
    habitId?: string;

    @IsDateString()
    date: string; // ISO or YYYY-MM-DD

    @IsString()
    title: string;

    @IsString()
    correction: string;

    @IsString()
    @IsOptional()
    reason?: string;
}
