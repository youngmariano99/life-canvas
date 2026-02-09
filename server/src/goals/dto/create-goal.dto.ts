import { IsString, IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';

export class CreateGoalDto {
    @IsString()
    roleId: string;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @Min(1)
    @Max(4)
    @IsOptional()
    quarter?: number;

    @IsInt()
    @Min(1)
    @Max(2)
    @IsOptional()
    semester?: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsDateString()
    @IsOptional()
    targetDate?: Date;

    @IsOptional()
    subGoals?: any[];
}
