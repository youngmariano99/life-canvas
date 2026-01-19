import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateHabitLogDto {
    @IsUUID()
    habitId: string;

    @IsDateString()
    date: string; // YYYY-MM-DD or ISO

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    note?: string;
}
