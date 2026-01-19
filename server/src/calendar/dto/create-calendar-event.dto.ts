import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateCalendarEventDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsDateString()
    @IsOptional()
    date?: string; // Frontend alias for startDate

    @IsBoolean()
    @IsOptional()
    isAllDay?: boolean;

    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    tag?: string;

    @IsString()
    @IsOptional()
    color?: string; // Hex color code
}
