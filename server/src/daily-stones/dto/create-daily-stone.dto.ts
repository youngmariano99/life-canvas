import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDailyStoneDto {
    @IsDateString()
    date: string; // YYYY-MM-DD or ISO

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    roleId?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;

    @IsString()
    @IsOptional()
    note?: string;
}
